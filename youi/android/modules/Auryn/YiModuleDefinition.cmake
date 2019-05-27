###
# Copyright (c) You i Labs Inc.
#
# This source code is licensed under the MIT license found in the
# LICENSE file in the root directory of this source tree.
#
###
include(${YouiEngine_DIR}/cmake/Modules/android/YiModuleUtilities.cmake)

get_filename_component(_PROJECT_DIR ${CMAKE_CURRENT_LIST_DIR}/../../.. ABSOLUTE)

if(YI_LOCAL_JS)
    set(USE_LOCAL_JS "YI_LOCAL_JS=ON")

    if(YI_LOCAL_JS_INLINE)
        set(USE_JS_INLINE "YI_LOCAL_JS_INLINE=ON")
    endif()

    if(NOT YI_BUNDLED_ASSETS_DEST)
        message(FATAL_ERROR "Local JS bundles are being used but the YI_BUNDLED_ASSETS_DEST variable was not passed in.")
    endif()

    set(USE_BUNDLED_ASSETS_DEST "YI_BUNDLED_ASSETS_DEST=${YI_BUNDLED_ASSETS_DEST}")
endif()

set(YI_REACT_APP ON)
yi_define_module(Auryn
    TYPE APPLICATION
    PROJECT_DIR ${_PROJECT_DIR}
    VARIABLES
        "YI_PROJECT_NAME=Auryn"
        "YI_PACKAGE_NAME=tv.youi.auryn"
        "YI_DISPLAY_NAME=\"Auryn\""
        "YI_BUILD_NUMBER=1"
        "YI_VERSION_NUMBER=1.0.0"
        "YI_API_LEVEL=21"
        "YI_TARGET_SDK_API_LEVEL=27"
        ${USE_LOCAL_JS}
        ${USE_JS_INLINE}
        ${USE_BUNDLED_ASSETS_DEST}
)
