###
# Copyright (c) You i Labs Inc.
#
# This source code is licensed under the MIT license found in the
# LICENSE file in the root directory of this source tree.
#
###
file(GLOB_RECURSE YI_PROJECT_SOURCE
  "../node_modules/@youi-public/status-bar/src/cpp/*.cpp"
  "../node_modules/@youi-public/orientation/src/cpp/*.cpp" "src/*.cpp")

file(GLOB_RECURSE YI_PROJECT_HEADERS
  "../node_modules/@youi-public/status-bar/src/cpp/*.h"
  "../node_modules/@youi-public/orientation/src/cpp/*.h" "src/*.h")
