package com.protonicsapp.onestep

import android.util.Log
import co.onestep.android.core.OSTActivityType
import co.onestep.android.core.OSTParamName
import co.onestep.android.core.OSTResult
import co.onestep.android.core.OSTUserAttributes
import co.onestep.android.core.OneStep
import co.onestep.android.core.motionLab.OSTAnalyserState
import co.onestep.android.core.motionLab.OSTMockIMU
import co.onestep.android.core.motionLab.OSTMotionMeasurement
import co.onestep.android.core.motionLab.OSTRecorderState
import co.onestep.android.core.motionLab.OSTTimeRangeFilter
import co.onestep.android.core.motionLab.OSTTimeRangedDataRequest
import co.onestep.android.core.motionLab.OSTUserInputMetaData
import co.onestep.android.core.monitoring.OSTDailySummariesQuery
import co.onestep.android.core.monitoring.OSTDefaultNotificationConfig
import co.onestep.android.core.monitoring.OSTMonitoringConfig
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.Locale

class OneStepSDKModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    private val scope = CoroutineScope(SupervisorJob() + Dispatchers.Main)
    private val TAG = "OneStepSDK"

    override fun getName() = "OneStepSDK"

    // ── Lifecycle ──────────────────────────────────────────

    @ReactMethod
    fun initialize(clientToken: String, promise: Promise) {
        try {
            val app = reactApplicationContext.applicationContext as android.app.Application
            OneStep.initialize(application = app, clientToken = clientToken)
            observeRecorderState()
            observeAnalyserState()
            observeSteps()
            promise.resolve(true)
        } catch (e: Exception) {
            Log.e(TAG, "initialize failed", e)
            promise.reject("INIT_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun identify(userId: String, identityVerification: String, promise: Promise) {
        scope.launch {
            try {
                val result = OneStep.identify(
                    userId = userId,
                    identityVerification = identityVerification
                )
                val map = Arguments.createMap()
                when (result) {
                    is OSTResult.Success -> {
                        map.putBoolean("success", true)
                        promise.resolve(map)
                    }
                    is OSTResult.Error -> {
                        map.putBoolean("success", false)
                        map.putString("message", result.message)
                        promise.resolve(map)
                    }
                }
            } catch (e: Exception) {
                promise.reject("IDENTIFY_ERROR", e.message, e)
            }
        }
    }

    // ── Monitoring ─────────────────────────────────────────

    @ReactMethod
    fun enableMonitoring(promise: Promise) {
        scope.launch {
            try {
                OneStep.monitoring.enable(OSTMonitoringConfig())
                OneStep.monitoring.setCustomMonitoringNotification(
                    OSTDefaultNotificationConfig(
                        title = { "Protonics is monitoring your gait" },
                        text = null,
                        icon = android.R.drawable.ic_dialog_info,
                    )
                )
                promise.resolve(true)
            } catch (e: Exception) {
                promise.reject("MONITORING_ERROR", e.message, e)
            }
        }
    }

    @ReactMethod
    fun optInMonitoring(promise: Promise) {
        scope.launch {
            try {
                OneStep.monitoring.optIn()
                promise.resolve(true)
            } catch (e: Exception) {
                promise.reject("OPT_IN_ERROR", e.message, e)
            }
        }
    }

    @ReactMethod
    fun optOutMonitoring(promise: Promise) {
        scope.launch {
            try {
                OneStep.monitoring.optOut()
                promise.resolve(true)
            } catch (e: Exception) {
                promise.reject("OPT_OUT_ERROR", e.message, e)
            }
        }
    }

    @ReactMethod
    fun syncData(promise: Promise) {
        try {
            OneStep.sync()
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("SYNC_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun getDailySummaries(promise: Promise) {
        scope.launch {
            try {
                val summaries = OneStep.monitoring.getDailySummaries(OSTDailySummariesQuery())
                val array = Arguments.createArray()
                summaries.forEach { s ->
                    val map = Arguments.createMap()
                    map.putDouble("timestamp", s.timestamp.toDouble())
                    map.putInt("steps", s.parameters[OSTParamName.WALKING_STEPS]?.toInt() ?: 0)
                    val params = Arguments.createMap()
                    s.parameters.forEach { (k, v) -> params.putDouble(k.name, v.toDouble()) }
                    map.putMap("params", params)
                    array.pushMap(map)
                }
                promise.resolve(array)
            } catch (e: Exception) {
                promise.reject("SUMMARIES_ERROR", e.message, e)
            }
        }
    }

    // ── MotionLab (Active Recording) ───────────────────────

    @ReactMethod
    fun startRecording(durationMs: Double, promise: Promise) {
        scope.launch {
            try {
                OneStep.motionLab.reset()
                OneStep.motionLab.start(
                    activityType = OSTActivityType.WALK,
                    durationMillis = durationMs.toLong(),
                    userInputMetadata = null,
                    customMetadata = mapOf("source" to "ProtonicsApp"),
                )
                promise.resolve(null)
            } catch (e: Exception) {
                promise.reject("RECORDING_ERROR", e.message, e)
            }
        }
    }

    @ReactMethod
    fun stopRecording(promise: Promise) {
        scope.launch {
            try {
                OneStep.motionLab.stop()
                promise.resolve(null)
            } catch (e: Exception) {
                promise.reject("STOP_ERROR", e.message, e)
            }
        }
    }

    @ReactMethod
    fun analyze(timeoutMs: Double, promise: Promise) {
        scope.launch {
            try {
                val measurement = OneStep.motionLab.analyze(timeout = timeoutMs.toLong())
                if (measurement != null) {
                    promise.resolve(measurementToMap(measurement))
                } else {
                    promise.resolve(null)
                }
            } catch (e: Exception) {
                promise.reject("ANALYZE_ERROR", e.message, e)
            }
        }
    }

    @ReactMethod
    fun readMeasurements(afterTimestamp: Double, promise: Promise) {
        scope.launch {
            try {
                val request = if (afterTimestamp > 0) {
                    OSTTimeRangedDataRequest(
                        timeRangeFilter = OSTTimeRangeFilter.after(afterTimestamp.toLong())
                    )
                } else {
                    OSTTimeRangedDataRequest()
                }
                val records = OneStep.motionLab.readMotionMeasurements(request)
                val array = Arguments.createArray()
                records.forEach { array.pushMap(measurementToMap(it)) }
                promise.resolve(array)
            } catch (e: Exception) {
                promise.reject("READ_ERROR", e.message, e)
            }
        }
    }

    // ── User Attributes ────────────────────────────────────

    @ReactMethod
    fun updateUserAttributes(attrs: ReadableMap, promise: Promise) {
        scope.launch {
            try {
                val builder = OSTUserAttributes.Builder()
                if (attrs.hasKey("firstName")) builder.withFirstName(attrs.getString("firstName")!!)
                if (attrs.hasKey("lastName")) builder.withLastName(attrs.getString("lastName")!!)
                if (attrs.hasKey("sex")) {
                    val sex = when (attrs.getString("sex")) {
                        "MALE" -> OSTUserAttributes.Sex.MALE
                        "FEMALE" -> OSTUserAttributes.Sex.FEMALE
                        else -> null
                    }
                    sex?.let { builder.withSex(it) }
                }
                if (attrs.hasKey("dateOfBirth")) {
                    val df = SimpleDateFormat("yyyy-MM-dd", Locale.US)
                    df.parse(attrs.getString("dateOfBirth")!!)?.let { builder.withDateOfBirth(it) }
                }
                OneStep.updateUserAttributes(builder.build())
                promise.resolve(null)
            } catch (e: Exception) {
                promise.reject("USER_ATTR_ERROR", e.message, e)
            }
        }
    }

    // ── Mock sensors (emulator) ────────────────────────────

    @ReactMethod
    fun enableMockSensors(promise: Promise) {
        try {
            OneStep.motionLab.setMockIMU(OSTMockIMU.SUCCESSFUL)
            promise.resolve(null)
        } catch (e: Exception) {
            promise.reject("MOCK_ERROR", e.message, e)
        }
    }

    // ── Event Observers ────────────────────────────────────

    private fun observeRecorderState() {
        scope.launch {
            OneStep.motionLab.recorderState.collect { state ->
                sendEvent("onRecorderStateChange", state.name)
            }
        }
    }

    private fun observeAnalyserState() {
        scope.launch {
            OneStep.motionLab.analyserState.collect { state ->
                val name = when (state) {
                    is OSTAnalyserState.Failed -> "Failed"
                    else -> state::class.simpleName ?: "Unknown"
                }
                sendEvent("onAnalyserStateChange", name)
            }
        }
    }

    private fun observeSteps() {
        scope.launch {
            OneStep.motionLab.stepsCount.collect { count ->
                sendEvent("onStepsUpdate", count.toString())
            }
        }
    }

    private fun sendEvent(name: String, data: String) {
        reactApplicationContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(name, data)
    }

    @ReactMethod
    fun addListener(eventName: String) { /* required for NativeEventEmitter */ }
    @ReactMethod
    fun removeListeners(count: Int) { /* required for NativeEventEmitter */ }

    // ── Helpers ────────────────────────────────────────────

    private fun measurementToMap(m: OSTMotionMeasurement): WritableMap {
        val map = Arguments.createMap()
        map.putString("id", m.id)
        map.putDouble("timestamp", m.timestamp.time.toDouble())
        map.putString("type", m.type.name)
        map.putString("resultState", m.resultState?.name ?: "UNKNOWN")
        m.metadata?.let { meta ->
            map.putInt("steps", meta.steps ?: 0)
        }
        m.error?.let { err ->
            map.putString("error", err.toString())
        }
        val params = Arguments.createMap()
        m.params.forEach { (k, v) -> params.putDouble(k.name, v.toDouble()) }
        map.putMap("params", params)
        return map
    }
}
