# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-10-26
### 🚀 Initial Release
- **Introduced** the `Result` type, inspired by Kotlin's `Result` type, for handling success and failure scenarios.
- **Added** `runCatching` function to safely execute code and handle exceptions.
- **Implemented** `map` and `mapCatching` methods to transform successful results and catch errors during transformation.
- **Added** `recover` and `recoverCatching` methods to provide fallback values and handle errors during recovery.
- **Introduced** `getOrElse` and `getOrDefault` methods to retrieve values with defaults in case of failure.
- **Implemented** `fold` method to handle both success and failure cases in one function.
- **Provided** utility methods like `onSuccess` and `onFailure` for executing actions based on the result type.
- **Added** `toString` method to convert the `Result` object to a string representation for easy logging and debugging.

---

### **How to Use This Changelog**
This changelog documents all releases and notable changes. Use this to understand what’s new, improved, or fixed in each version.
