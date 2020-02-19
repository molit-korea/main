package com.example.miyon.tts;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.ImageView;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.Toast;

import com.google.zxing.integration.android.IntentIntegrator;
import com.google.zxing.integration.android.IntentResult;
import com.tsengvn.typekit.TypekitContextWrapper;

import org.json.JSONException;
import org.json.JSONObject;

public class Passenger extends Activity {

    RelativeLayout star;
    RelativeLayout search;
    IntentIntegrator scan;
    private ImageView im1;
    private ImageView im2;
    private TextView bus_txt;
    private TextView pas_txt;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.passenger);
        star = (RelativeLayout)findViewById(R.id.star);
        search = (RelativeLayout) findViewById(R.id.search);

        scan = new IntentIntegrator(this);


        star.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                scan.setPrompt("스캔중...");
                scan.initiateScan();
            }
        });

        search.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {

                Intent myIntent = new Intent(getApplicationContext(), search.class);
                startActivity(myIntent);
            }
        });



    }
    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        IntentResult result = IntentIntegrator.parseActivityResult(requestCode, resultCode, data);
        if (result != null)
        {
            //qrcode 가 없으면
            if (result.getContents() == null)
            {
                Toast.makeText(Passenger.this, "존재하지않는 QR코드입니다.", Toast.LENGTH_SHORT).show();
            }
            else
            {
                //qrcode 결과가 있으면
                Toast.makeText(Passenger.this, "스캔완료!", Toast.LENGTH_SHORT).show();
                try
                {
                    //data를 json으로 변환
                    JSONObject obj = new JSONObject(result.getContents().toString());
                    /*name_txt.setText(obj.getString("name"));
                    num_txt.setText(obj.getString("num")+"번");
                    time_txt.setText(obj.getString("time1")+" / "+obj.getString("time2"));
*/
                    Intent myIntent = new Intent(getApplicationContext(), star.class);
                    myIntent.putExtra("이름",obj.getString("name"));
                    myIntent.putExtra("번호",obj.getString("num"));
                    startActivity(myIntent);

                } catch (JSONException e)
                {
                    e.printStackTrace();
                    //Toast.makeText(MainActivity.this, result.getContents(), Toast.LENGTH_LONG).show();
                   /* name_txt.setText(result.getContents());*/
                }
            }

        } else {
            super.onActivityResult(requestCode, resultCode, data);
        }


    }
    @Override
    protected void attachBaseContext(Context newBase){
        super.attachBaseContext(TypekitContextWrapper.wrap(newBase));
    }
}