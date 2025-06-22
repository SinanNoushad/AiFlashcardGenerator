cmake_minimum_required(VERSION 3.18.1)
project("AiFlashcardGenerator")

# Include React Native CMake utils
include(${REACT_ANDROID_DIR}/ReactAndroid/cmake-utils/ReactNative-application.cmake)

# Basic configuration
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

# Add your app as a library
add_library(
  ${APP_NAME}
  SHARED
  ${GENERATED_SRCS}
  ../../../../src/App.tsx
)

# Target dependencies
target_link_libraries(
  ${APP_NAME}
  ReactAndroid
  jsi
  ${log-lib}
)

# Conditional includes for modules
macro(add_conditional_subdirectory module_path)
  if(EXISTS ${module_path}/CMakeLists.txt)
    add_subdirectory(${module_path})
  endif()
endmacro()

add_conditional_subdirectory(${REACTNATIVE_EXECUTORCH_DIR})