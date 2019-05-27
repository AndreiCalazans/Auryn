/**
 * Copyright (c) You i Labs Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

#include "App.h"
#include "../../node_modules/@youi-public/orientation/src/cpp/Orientation.h"
#include <appium/YiWebDriverLocator.h>
#include <cxxreact/JSBigString.h>
#include <glog/logging.h>

#if defined(YI_LOCAL_JS_APP)
    #if defined(YI_INLINE_JS_APP)
        #include "youireact/JsBundleLoaderInlineString.h"
        const char INLINE_JS_BUNDLE_STRING[] =
            #include "InlineJSBundleGenerated/index.youi.bundle"
            ;
    #else
        #include "youireact/JsBundleLoaderLocalAsset.h"
    #endif
#else
    #include "youireact/JsBundleLoaderRemote.h"
#endif

App::App() = default;

App::~App() = default;

using namespace yi::react;

bool App::UserInit()
{
    // Start the web driver for allowing the use of Appium.
    CYIWebDriver *pWebDriver = CYIWebDriverLocator::GetWebDriver();
    if (pWebDriver)
    {
        pWebDriver->Start();
    }

#if !defined(YI_MINI_GLOG)
    // miniglog defines this using a non-const char * causing a compile error and it has no implementation anyway.
    static bool isGoogleLoggingInitialized = false;
    if (!isGoogleLoggingInitialized)
    {
        google::InitGoogleLogging("--logtostderr=1");
        isGoogleLoggingInitialized = true;
    }
#endif

#if defined(YI_LOCAL_JS_APP)
    #if defined(YI_INLINE_JS_APP)
        std::unique_ptr<JsBundleLoader> pBundleLoader(new JsBundleLoaderInlineString(INLINE_JS_BUNDLE_STRING));
    #else
        std::unique_ptr<JsBundleLoader> pBundleLoader(new JsBundleLoaderLocalAsset());
    #endif
#else
    std::unique_ptr<JsBundleLoader> pBundleLoader(new JsBundleLoaderRemote(CYIUrl("http://localhost:8081/index.youi.bundle?platform=ios&dev=false&hot=false&minify=false")));
#endif

    PlatformApp::SetJsBundleLoader(std::move(pBundleLoader));
    
    bool userInitSuccess = PlatformApp::UserInit();
    
    GetBridge().AddModule<Orientation>();
        
    return userInitSuccess;
}

bool App::UserStart()
{
    return PlatformApp::UserStart();
}

void App::UserUpdate()
{
    PlatformApp::UserUpdate();
}
