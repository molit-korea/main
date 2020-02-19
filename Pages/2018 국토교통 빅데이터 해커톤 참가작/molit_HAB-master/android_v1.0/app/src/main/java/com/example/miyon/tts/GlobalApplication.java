package com.example.miyon.tts;

import android.app.Activity;
import android.app.Application;

import com.kakao.auth.KakaoSDK;
import com.tsengvn.typekit.Typekit;

public class GlobalApplication extends Application {
    private static volatile GlobalApplication instance = null;
    private static volatile Activity currentActivity = null;
    @Override
    public void onCreate() {
        super.onCreate();
        Typekit.getInstance()
                .addNormal(Typekit.createFromAsset(this, "fonts/NanumBarunpenR.ttf"))
                .addBold(Typekit.createFromAsset(this, "fonts/NanumBarunpenB.ttf"))
                .addItalic(Typekit.createFromAsset(this, "fonts/BMDOHYEON_ttf.ttf"));// "fonts/폰트.ttf"
        instance = this;
        KakaoSDK.init(new KakaoSDKAdapter());
    }
    public static GlobalApplication getGlobalApplicationContext(){
        return instance;}

    public static void setCurrentActivity(Activity currentActivity){GlobalApplication.currentActivity = currentActivity;
    }

    public static Activity getCurrentActivity(){
        return currentActivity;}
}
