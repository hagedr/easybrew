package com.orderhub.app_config;

import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CallbackContext;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.os.Bundle;

public class AppConfig extends CordovaPlugin {
  @Override
  public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
    if (action.equals("fetch")) {
      this.fetch(args, callbackContext);
      return true;
    }

    return false;
  }

  private void fetch(JSONArray fields, CallbackContext callbackContext) {
    JSONObject options = new JSONObject();

    try {
      PackageManager packageManager = this.cordova.getActivity().getPackageManager();
      ApplicationInfo app = packageManager.getApplicationInfo(this.cordova.getActivity().getPackageName(), PackageManager.GET_META_DATA);
      Bundle bundle = app.metaData;

      for (int i = 0; i < fields.length(); i++) {
        String field = fields.getString(i);

        if (bundle.containsKey(field)) {
          Object value = bundle.get(field);
          options.put(field, value);
        }
      }

      callbackContext.success(options);
    } catch (Exception ex) {
      callbackContext.error("Can't read application settings.");
    }
  }
}
