package com.smart.droid.gcm;

import android.app.IntentService;
import android.content.Intent;
import android.util.Log;

import android.support.v4.content.LocalBroadcastManager;
import com.google.android.gms.gcm.GoogleCloudMessaging;
import com.google.android.gms.iid.InstanceID;

public class GCMRegister extends IntentService {

    private static final String TAG = "GCMRegister";

    public GCMRegister() {
        super(TAG);
    }

    @Override
    protected void onHandleIntent(Intent intent) {

        String token = null;
        try {

            final String senderId = intent.getExtras().getString(GCMPush.C_SENDER_ID);

            Log.d(TAG, "Register for Sender : " + senderId);

            //Register and collect token
            InstanceID instanceID = InstanceID.getInstance(this);
            token = instanceID.getToken(senderId, GoogleCloudMessaging.INSTANCE_ID_SCOPE, null);

        } catch (Exception e) {
            Log.d(TAG, "Failed to complete token refresh", e);
        }

        // Notify that registration has completed
        Intent registrationComplete = new Intent(GCMPush.GCM_REG_BROADCAST_KEY);
        registrationComplete.putExtra("token", token); 
        LocalBroadcastManager.getInstance(this).sendBroadcast(registrationComplete);

    }           

}