package com.smart.droid.gcm;

import org.apache.cordova.*;
import org.json.JSONArray;
import org.json.JSONException;

import android.content.Intent;
import android.content.Context;
import android.content.IntentFilter;
import android.content.BroadcastReceiver;
import android.support.v4.content.LocalBroadcastManager;

import com.smart.droid.gcm.GCMRegister;

public class GCMPush extends CordovaPlugin {

    
    private CallbackContext callback = null;

    private static final String C_REGISTER = "register";
    public static final String C_SENDER_ID = "SENDER_ID";

    public static final String GCM_REG_BROADCAST_KEY = "GCM_REGISTRATION";

    private String senderId;


    @Override
    public void initialize(CordovaInterface cordova, CordovaWebView webView) {
        super.initialize(cordova, webView);

        if (registerBroadcastReceiver != null) {
            LocalBroadcastManager.getInstance(cordova.getActivity()).registerReceiver(registerBroadcastReceiver,
                    new IntentFilter(GCM_REG_BROADCAST_KEY));
        }


    }    

    @Override
    public boolean execute(String action, JSONArray data, CallbackContext callbackContext) throws JSONException {

        try {
            callback = callbackContext;
            if (C_REGISTER.equals(action)) {
                
                //Collect input validate
                senderId = data.optJSONObject(0).optString("senderId", null);
                if (senderId == null) {
                    callbackContext.error("Sender ID not found");
                    return false;
                }

                // Start IntentService to register this application with GCM.
                Intent intent = new Intent(cordova.getActivity(), GCMRegister.class);
                intent.putExtra(C_SENDER_ID, senderId);
                cordova.getActivity().startService(intent);

                return true;

            } else {
                callbackContext.error("Action not Recognized.");       
                return false;
            }
        } catch (Exception e) {
            e.printStackTrace();
            callbackContext.error(e.getMessage());
            return false;
        }            
    }


    private BroadcastReceiver registerBroadcastReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            String token = intent.getStringExtra("token");
            callback.success(token);
        }
    };


}