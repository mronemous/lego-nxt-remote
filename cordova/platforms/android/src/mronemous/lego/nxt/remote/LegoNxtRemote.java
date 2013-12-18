/*
       Licensed to the Apache Software Foundation (ASF) under one
       or more contributor license agreements.  See the NOTICE file
       distributed with this work for additional information
       regarding copyright ownership.  The ASF licenses this file
       to you under the Apache License, Version 2.0 (the
       "License"); you may not use this file except in compliance
       with the License.  You may obtain a copy of the License at

         http://www.apache.org/licenses/LICENSE-2.0

       Unless required by applicable law or agreed to in writing,
       software distributed under the License is distributed on an
       "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
       KIND, either express or implied.  See the License for the
       specific language governing permissions and limitations
       under the License.
 */

package mronemous.lego.nxt.remote;

import android.content.Context;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;
import android.webkit.WebView;
import org.apache.cordova.Config;
import org.apache.cordova.CordovaActivity;

public class LegoNxtRemote extends CordovaActivity 
{
    @Override
    public void onCreate(Bundle savedInstanceState)
    {
        RemoteDebugger remoteDebugger = new RemoteDebugger(getContext());
        remoteDebugger.start();

        super.onCreate(savedInstanceState);
        super.init();
        // Set by <content src="index.html" /> in config.xml
        super.loadUrl(Config.getStartUrl());
        //super.loadUrl("file:///android_asset/www/index.html")
    }

    public class RemoteDebugger {

        private Context mContext;
        public RemoteDebugger(Context context) {
            mContext = context;
        }

        public boolean isDebuggable(Context ctx)
        {
            boolean debuggable = false;

            PackageManager pm = ctx.getPackageManager();
            try
            {
                ApplicationInfo appinfo = pm.getApplicationInfo(ctx.getPackageName(), 0);
                debuggable = (0 != (appinfo.flags &= ApplicationInfo.FLAG_DEBUGGABLE));
            }
            catch(PackageManager.NameNotFoundException e)
            {
            /*debuggable variable will remain false*/
            }

            return debuggable;
        }

        public void start() {

            if(isAvailable()) {


                WebView.setWebContentsDebuggingEnabled(true);
            }
        }

        private boolean isAvailable() {
            return (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT && isDebuggable(mContext));
        }
    }
}


