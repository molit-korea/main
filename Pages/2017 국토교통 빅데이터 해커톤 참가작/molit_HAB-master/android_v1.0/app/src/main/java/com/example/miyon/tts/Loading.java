package com.example.miyon.tts;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;

import com.tsengvn.typekit.TypekitContextWrapper;

/**
 * Created by jinsu on 2017-08-29.
 */

public class Loading extends Activity {

    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.loading);
        Handler han = new Handler();
        han.postDelayed(new Runnable() {

            public void run() {
                // 메인액티비티를 다시 띄워주고 현재 액티비티를 종료한다.
                startActivity(new Intent(Loading.this, Cover.class));
                finish();
            }

        }, 2000); // 인트로화면이 떠 있을 시간..
    }
    @Override
    protected void attachBaseContext(Context newBase){
        super.attachBaseContext(TypekitContextWrapper.wrap(newBase));
    }

}
