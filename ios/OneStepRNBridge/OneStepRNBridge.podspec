Pod::Spec.new do |s|
  s.name         = "OneStepRNBridge"
  s.version      = "1.0.0"
  s.summary      = "React Native bridge for OneStep SDK iOS"
  s.homepage     = "https://onestep.co"
  s.license      = "MIT"
  s.authors      = "Protonics"

  s.platforms    = { :ios => "16.0" }
  s.source       = { :path => "." }

  s.source_files = "*.{h,m,mm,swift}"

  s.dependency "React-Core"
  s.dependency "OneStepSDK"
end
