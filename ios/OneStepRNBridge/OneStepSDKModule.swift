import Foundation
import React
import OneStepSDK
import Combine

@objc(OneStepSDK)
class OneStepSDKBridgeModule: RCTEventEmitter {

  private var cancellables = Set<AnyCancellable>()
  private var hasObservers = false
  private var storedClientToken: String = ""
  private var storedDistinctId: String = "anonymous"

  // MARK: - RCTEventEmitter

  override static func requiresMainQueueSetup() -> Bool {
    return true
  }

  override func supportedEvents() -> [String]! {
    return ["onRecorderStateChange", "onAnalyserStateChange", "onStepsUpdate"]
  }

  override func startObserving() {
    hasObservers = true
  }

  override func stopObserving() {
    hasObservers = false
    cancellables.removeAll()
  }

  // MARK: - initialize

  @objc(initialize:resolver:rejecter:)
  func initialize(
    _ clientToken: String,
    resolver: @escaping RCTPromiseResolveBlock,
    rejecter: @escaping RCTPromiseRejectBlock
  ) {
    storedClientToken = clientToken
    let appId = "Protonics-Sandbox"
    let distinctId = storedDistinctId
    DispatchQueue.main.async {
      let config = OSTConfiguration(enableMonitoringFeature: true)
      OSTSDKCore.shared.initialize(
        appId: appId,
        apiKey: clientToken,
        distinctId: distinctId,
        identityVerification: nil,
        configuration: config
      ) { success in
        if success {
          OSTSDKCore.shared.registerBGTasks()
        }
        resolver(success)
      }
    }
  }

  // MARK: - identify

  @objc(identify:identityVerification:resolver:rejecter:)
  func identify(
    _ userId: String,
    identityVerification: String,
    resolver: @escaping RCTPromiseResolveBlock,
    rejecter: @escaping RCTPromiseRejectBlock
  ) {
    storedDistinctId = userId
    let clientToken = storedClientToken
    let ivSecret: String? = identityVerification.isEmpty ? nil : identityVerification
    DispatchQueue.main.async {
      let config = OSTConfiguration(enableMonitoringFeature: true)
      OSTSDKCore.shared.initialize(
        appId: "Protonics-Sandbox",
        apiKey: clientToken,
        distinctId: userId,
        identityVerification: ivSecret,
        configuration: config
      ) { success in
        let result: [String: Any?] = [
          "success": success,
          "message": success ? nil : "Identify failed"
        ]
        resolver(result)
      }
    }
  }

  // MARK: - enableMonitoring

  @objc(enableMonitoring:rejecter:)
  func enableMonitoring(
    _ resolver: @escaping RCTPromiseResolveBlock,
    rejecter: @escaping RCTPromiseRejectBlock
  ) {
    let result = OSTSDKCore.shared.registerBackgroundMonitoring()
    resolver(result.isSuccess)
  }

  // MARK: - getDailySummaries

  @objc(getDailySummaries:rejecter:)
  func getDailySummaries(
    _ resolver: @escaping RCTPromiseResolveBlock,
    rejecter: @escaping RCTPromiseRejectBlock
  ) {
    Task {
      let records = await OSTSDKCore.shared.dailyAggregatedBackgroundWalks(
        startTime: nil,
        endTime: nil
      )
      let mapped: [[String: Any]] = records.map { record in
        var dict: [String: Any] = [
          "date": record.date_local,
          "timestamp": record.timestamp.timeIntervalSince1970 * 1000
        ]
        for (param, value) in record.parameters {
          dict[param.rawValue] = value
        }
        return dict
      }
      resolver(mapped)
    }
  }

  // MARK: - startRecording

  @objc(startRecording:resolver:rejecter:)
  func startRecording(
    _ durationMs: Double,
    resolver: @escaping RCTPromiseResolveBlock,
    rejecter: @escaping RCTPromiseRejectBlock
  ) {
    cancellables.removeAll()
    let recorder = OSTSDKCore.shared.getRecordingService()
    let durationSecs = Int(durationMs / 1000)

    recorder.recorderState
      .receive(on: DispatchQueue.main)
      .sink { [weak self] state in
        guard let self = self, self.hasObservers else { return }
        self.sendEvent(withName: "onRecorderStateChange", body: ["state": "\(state)"])
      }
      .store(in: &cancellables)

    recorder.analyzerState
      .receive(on: DispatchQueue.main)
      .sink { [weak self] state in
        guard let self = self, self.hasObservers else { return }
        self.sendEvent(withName: "onAnalyserStateChange", body: ["state": "\(state)"])
      }
      .store(in: &cancellables)

    // Subscribe to steps if the recorder is OSTRecorder
    if let ostRecorder = recorder as? OSTRecorder {
      ostRecorder.stepsCount
        .receive(on: DispatchQueue.main)
        .sink { [weak self] steps in
          guard let self = self, self.hasObservers else { return }
          self.sendEvent(withName: "onStepsUpdate", body: steps)
        }
        .store(in: &cancellables)
    }

    recorder.start(
      activityType: .walk,
      duration: durationSecs,
      userInputMetadata: nil,
      customMetadata: nil,
      enhancedMode: false
    )
    resolver(nil)
  }

  // MARK: - stopRecording

  @objc(stopRecording:rejecter:)
  func stopRecording(
    _ resolver: @escaping RCTPromiseResolveBlock,
    rejecter: @escaping RCTPromiseRejectBlock
  ) {
    let recorder = OSTSDKCore.shared.getRecordingService()
    recorder.stop()
    cancellables.removeAll()
    resolver(nil)
  }

  // MARK: - analyze

  @objc(analyze:resolver:rejecter:)
  func analyze(
    _ timeoutMs: Double,
    resolver: @escaping RCTPromiseResolveBlock,
    rejecter: @escaping RCTPromiseRejectBlock
  ) {
    let recorder = OSTSDKCore.shared.getRecordingService()
    Task {
      if let measurement = await recorder.analyze() {
        resolver(self.measurementToDict(measurement))
      } else {
        resolver(nil)
      }
    }
  }

  // MARK: - readMeasurements

  @objc(readMeasurements:resolver:rejecter:)
  func readMeasurements(
    _ afterTimestamp: Double,
    resolver: @escaping RCTPromiseResolveBlock,
    rejecter: @escaping RCTPromiseRejectBlock
  ) {
    let startDate: Date? = afterTimestamp > 0
      ? Date(timeIntervalSince1970: afterTimestamp / 1000.0)
      : nil
    let measurements = OSTSDKCore.shared.readMotionMeasurements(
      startTime: startDate,
      endTime: nil
    )
    let mapped = measurements.map { measurementToDict($0) }
    resolver(mapped)
  }

  // MARK: - updateUserAttributes

  @objc(updateUserAttributes:resolver:rejecter:)
  func updateUserAttributes(
    _ attrs: [String: Any],
    resolver: @escaping RCTPromiseResolveBlock,
    rejecter: @escaping RCTPromiseRejectBlock
  ) {
    var builder = OSTUserAttributes.Builder()
    if let firstName = attrs["firstName"] as? String {
      builder = builder.withFirstName(firstName)
    }
    if let lastName = attrs["lastName"] as? String {
      builder = builder.withLastName(lastName)
    }
    if let email = attrs["email"] as? String {
      builder = builder.withEmail(email)
    }
    if let sexStr = attrs["sex"] as? String,
       let sex = OSTUserAttributes.Sex(rawValue: sexStr) {
      builder = builder.withSex(sex)
    }
    OSTSDKCore.shared.updateUserAttributes(userAttributes: builder.build())
    resolver(nil)
  }

  // MARK: - enableMockSensors (no-op on iOS — real sensors always used)

  @objc(enableMockSensors:rejecter:)
  func enableMockSensors(
    _ resolver: @escaping RCTPromiseResolveBlock,
    rejecter: @escaping RCTPromiseRejectBlock
  ) {
    resolver(nil)
  }

  // MARK: - Private helpers

  private func measurementToDict(_ m: OSTMotionMeasurement) -> [String: Any] {
    var dict: [String: Any] = [
      "id": m.id.uuidString,
      "type": m.type,
      "timestamp": m.timestamp.timeIntervalSince1970 * 1000,
      "status": m.status.rawValue,
    ]
    if let params = m.parameters {
      dict["parameters"] = params
    }
    if let meta = m.metadata {
      var metaDict: [String: Any] = [:]
      if let steps = meta.steps { metaDict["steps"] = steps }
      if let seconds = meta.seconds { metaDict["seconds"] = seconds }
      dict["metadata"] = metaDict
    }
    if let resultState = m.result_state {
      dict["resultState"] = resultState.rawValue
    }
    return dict
  }
}
