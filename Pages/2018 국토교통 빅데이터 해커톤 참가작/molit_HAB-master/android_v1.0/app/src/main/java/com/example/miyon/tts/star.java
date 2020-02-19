package com.example.miyon.tts;

import android.app.Activity;
import android.app.ProgressDialog;
import android.content.Context;
import android.content.Intent;
import android.os.AsyncTask;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.RatingBar;
import android.widget.TextView;

import com.tsengvn.typekit.TypekitContextWrapper;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.URL;
import java.net.URLConnection;
import java.net.URLEncoder;

public class star extends Activity {

    TextView name_txt;
    EditText q4;
    Button btn;
    String driver_id;
    String driver_name;
    float a1;
    float a2;
    float a3;
    String a4;
    String link;
    String bus_num="752";

    @Override
    protected void attachBaseContext(Context newBase){
        super.attachBaseContext(TypekitContextWrapper.wrap(newBase));
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.star);
        Intent intent = getIntent();
        driver_id = intent.getStringExtra("번호");
        driver_name = intent.getStringExtra("이름");
        //bus_num = "752";
        name_txt = (TextView) findViewById(R.id.driverstar);
        name_txt.setText(driver_id + "번 버스 "+driver_name+ "기사님에게 별을 선물하세요!");

        // link = "http://yonwon01.cafe24.com/myun/insertout.php"; // 데이터 입력 용 url 넣기

        RatingBar q1 =(RatingBar) findViewById(R.id.a1);
        q1.setOnRatingBarChangeListener(new RatingBar.OnRatingBarChangeListener() {
            @Override
            public void onRatingChanged(RatingBar ratingBar, float rating,
                                        boolean fromUser) {
                a1 = rating;
            }
        });

        RatingBar q2 =(RatingBar) findViewById(R.id.a2);
        q2.setOnRatingBarChangeListener(new RatingBar.OnRatingBarChangeListener() {
            @Override
            public void onRatingChanged(RatingBar ratingBar, float rating,
                                        boolean fromUser) {
                a2 = rating;
            }
        });
        RatingBar q3 =(RatingBar) findViewById(R.id.a3);
        q3.setOnRatingBarChangeListener(new RatingBar.OnRatingBarChangeListener() {
            @Override
            public void onRatingChanged(RatingBar ratingBar, float rating,
                                        boolean fromUser) {
                a3 = rating;
            }
        });
        q4 =(EditText)findViewById(R.id.a4);

        Button send = (Button)findViewById(R.id.send);
        send.setOnClickListener(
                new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        //여기에 데이터 보내기 넣으면 됨
                        String s_a1;
                        String s_a2;
                        String s_a3;
                        String s_a4;
                        s_a1 = Float.toString(a1);
                        s_a2 = Float.toString(a2);
                        s_a3 = Float.toString(a3);
                        s_a4 = q4.getText().toString();
                        a4 = q4.getText().toString();
                        insertToDatabase(driver_id, bus_num, driver_name, s_a1, s_a2, s_a3, s_a4); //데이터를 입력한다다
                        System.out.println("a1 :" + a1);
                        System.out.println("a2 :" + a2);
                        System.out.println("a3 :" + a3);
                        Log.e("a4입니당",a4);
                        System.out.println("a4 :" + a4);
                    }
                });



    }

    private void insertToDatabase(String driver_id, String bus_num, String driver_name, String a1, String a2, String a3, String a4){

        class InsertData extends AsyncTask<String, Void, String> {
            ProgressDialog loading;



            @Override
            protected void onPreExecute() {
                super.onPreExecute();
                loading = ProgressDialog.show(star.this, "Please Wait", null, true, true);
            }

            @Override
            protected void onPostExecute(String s) {
                super.onPostExecute(s);
                loading.dismiss();
                // Toast.makeText(getApplicationContext(),s,Toast.LENGTH_LONG).show();
            }

            @Override
            protected String doInBackground(String... params) {

                try{
                    String driver_id = (String)params[0];
                    String bus_num = (String)params[1];
                    String driver_name = (String)params[2];
                    String a1 = (String)params[3];
                    String a2 = (String)params[4];
                    String a3 = (String)params[5];
                    String a4 = (String)params[6];
                    for(int i=0; i<params.length;i++)
                    {
                        System.out.println("이것이다 !"+params[i]);
                    }

                    String link="https://molit-hackerton-2017-csxion.c9users.io/molit_v1.0/eval_process.php";
                    String data  = URLEncoder.encode("k_id", "UTF-8") + "=" + URLEncoder.encode(driver_id, "UTF-8");
                    data += "&" + URLEncoder.encode("bus_num", "UTF-8") + "=" + URLEncoder.encode(bus_num, "UTF-8");
                    data += "&" + URLEncoder.encode("bus_name", "UTF-8") + "=" + URLEncoder.encode(driver_name, "UTF-8");
                    data += "&" + URLEncoder.encode("q1", "UTF-8") + "=" + URLEncoder.encode(a1, "UTF-8");
                    data += "&" + URLEncoder.encode("q2", "UTF-8") + "=" + URLEncoder.encode(a2, "UTF-8");
                    data += "&" + URLEncoder.encode("q3", "UTF-8") + "=" + URLEncoder.encode(a3, "UTF-8");
                    data += "&" + URLEncoder.encode("q4", "UTF-8") + "=" + URLEncoder.encode(a4, "UTF-8");

                    URL url = new URL(link);
                    URLConnection conn = url.openConnection();

                    conn.setDoOutput(true);
                    OutputStreamWriter wr = new OutputStreamWriter(conn.getOutputStream());

                    wr.write( data );
                    wr.flush();

                    BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getInputStream()));

                    StringBuilder sb = new StringBuilder();
                    String line = null;

                    // Read Server Response
                    while((line = reader.readLine()) != null)
                    {
                        sb.append(line);
                        break;
                    }
                    return sb.toString();
                }
                catch(Exception e){
                    return new String("Exception: " + e.getMessage());
                }

            }
        }

        InsertData task = new InsertData();
        task.execute(driver_id,bus_num,driver_name,a1,a2,a3,a4);
    }

}