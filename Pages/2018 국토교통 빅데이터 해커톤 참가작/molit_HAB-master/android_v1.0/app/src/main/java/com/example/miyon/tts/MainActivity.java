package com.example.miyon.tts;

import android.Manifest;
import android.app.Activity;
import android.app.FragmentManager;
import android.app.ProgressDialog;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.graphics.drawable.Drawable;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.AsyncTask;
import android.os.Bundle;
import android.speech.tts.TextToSpeech;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.support.v4.app.ActivityCompat;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.widget.BaseAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ListView;
import android.widget.ProgressBar;
import android.widget.RatingBar;
import android.widget.TabHost;
import android.widget.TextView;
import android.widget.Toast;

import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.api.GoogleApiClient;
import com.google.android.gms.maps.CameraUpdate;
import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.MapFragment;
import com.google.android.gms.maps.MapsInitializer;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.model.BitmapDescriptorFactory;
import com.google.android.gms.maps.model.CircleOptions;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.Marker;
import com.google.android.gms.maps.model.MarkerOptions;
import com.tsengvn.typekit.TypekitContextWrapper;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Locale;
import java.util.Timer;
import java.util.TimerTask;

public class MainActivity extends Activity implements TextToSpeech.OnInitListener, OnMapReadyCallback
        , GoogleApiClient.ConnectionCallbacks, GoogleApiClient.OnConnectionFailedListener,TabHost.OnTabChangeListener {

    public static TextToSpeech tts;
    private Button btn;
    private EditText txt;
    private TextView tv;

    public static String username;
    public static String userid;
    //진수
    // private GoogleApiClient mGoogleApi = null;
    public static GoogleMap mGoogleMap = null;
    // private Marker mMarker = null;
    public static MapFragment mapf = null;
    private LocationManager locm = null;
    private LocationListener li = null;
    private RatingBar rating = null;
    private TextView rat_txt = null;
    private TextView txt1 = null;

    private TextView txt2 = null;
    private TextView txt3 = null;
    private TextView txt_1 = null;
    private TextView txt_2 = null;
    private TextView txt_3 = null;
    private ProgressBar pr1 = null;
    private ProgressBar pr2 = null;
    private ProgressBar pr3 = null;
    private Animation ani = null;
    private ListView list = null;
    private My_list adapter = null;
    private MarkerOptions marker = null;
    static Marker m = null;
    public static String latitude;
    public static String longitude;
    public static TextView speed_txt = null;
    static Location loc_a = new Location("pointA");
    static Location loc_b = new Location("pointB");
    public static String my_lat;
    public static String my_lon;


    String myJSON;
    private static final String TAG_RESULTS="result";
    private static final String TAG_Q1 = "q1";
    private static final String TAG_Q2 = "q2";
    private static final String TAG_Q3 ="q3";
    private static final String TAG_Q4 ="q4";
    private static final String TAG_Q5 ="q5";
    private static final String TAG_LAT="lat";
    private static final String TAG_LON = "lon";
    JSONArray peoples = null;
    ArrayList<HashMap<String, String>> personList;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        Intent intent = getIntent();
        userid = "752";
        username = intent.getStringExtra("profile2");

        mGoogleMap = null;
       // getData("http://yonwon01.cafe24.com/myun/myundex.php");


        System.out.println("쫌dddddddddddddddddddddddddddddddddddd" + userid);


        TabHost tabHost1 = (TabHost) findViewById(R.id.tabHost1);
        tabHost1.setup();

        //locationlistener(진수)
        li = new GPS(MainActivity.this);
        locm = (LocationManager) getSystemService(Context.LOCATION_SERVICE);

        //맵뷰 framgment(진수)
        FragmentManager frag = getFragmentManager();
        mapf = (MapFragment) frag.findFragmentById(R.id.map);
        mapf.getMapAsync(this);

        ani = AnimationUtils.loadAnimation(this,R.anim.grow);
        rating = (RatingBar)findViewById(R.id.rating);
        rat_txt = (TextView)findViewById(R.id.txt);
        speed_txt = (TextView)findViewById(R.id.txt_speed);


        txt1 = (TextView)findViewById(R.id.txt1);
        txt2 = (TextView)findViewById(R.id.txt2);
        txt3 = (TextView)findViewById(R.id.txt3);
        txt_1 = (TextView)findViewById(R.id.txt_1);
        txt_2 = (TextView)findViewById(R.id.txt_2);
        txt_3 = (TextView)findViewById(R.id.txt_3);

        pr1 = (ProgressBar)findViewById(R.id.pro1);
        pr1.setIndeterminate(false);
        pr2 = (ProgressBar)findViewById(R.id.pro2);
        pr3 = (ProgressBar)findViewById(R.id.pro3);

        //리스트뷰
        list = (ListView)findViewById(R.id.list);
        adapter = new My_list();
        list.setAdapter(adapter);

        adapter.add("이 버스 정말 좋아요!!","2016/09/16",3);
        adapter.add("너무 빠르세요ㅠㅠ","2016/09/14",5);
        adapter.add("버스 안이 쾌적하고 기사 아저씨가 친절하세요","2016/09/11",1);
        adapter.add("항상 안전운행 해주셔서 감사드립니다.","2016/09/09",4);

        pr1.setAnimation(ani);
        pr2.setAnimation(ani);
        pr3.setAnimation(ani);


        pr1.setProgress(70);
        pr2.setProgress(45);
        pr3.setProgress(95);

        rating.setRating(2);
        rat_txt.setText(String.valueOf(rating.getRating()));
        txt1.setText("운전습관 점수");
        txt2.setText("교통법규 준수 점수");
        txt3.setText("친절도 점수");

        txt_1.setText(String.valueOf(pr1.getProgress()));
        txt_2.setText(String.valueOf(pr2.getProgress()));
        txt_3.setText(String.valueOf(pr3.getProgress()));


        MapsInitializer.initialize(getApplicationContext());

        String str = "mstr1:mstr2:mstr3:mstr4:mstr5";

        String[] my_split = str.split(":");
        for(int i=0; i<my_split.length;i++) {
            System.out.println("이것이다 : " + my_split[i]);
        }


        //첫번째 탭
        Drawable draw = getResources().getDrawable(R.drawable.gps_bus);
        TabHost.TabSpec ts1 = tabHost1.newTabSpec("Tab spec 1");
        ts1.setContent(R.id.content1);
        ts1.setIndicator("주행 중",draw);

        tabHost1.addTab(ts1);

        //두번째 탭
        TabHost.TabSpec ts2 = tabHost1.newTabSpec("Tab spec 2");
        ts2.setContent(R.id.content2);
        ts2.setIndicator("나의 별");
        tabHost1.addTab(ts2);

        GPS gps = new GPS(MainActivity.this);

        tabHost1.setOnTabChangedListener(this);

        tabHost1.getCurrentTab();

        //insertToDatabase2();
        String link;

        //getData2(); 기사님 별 화면 조회

        tts = new TextToSpeech(this, this); //인자 값 context , 리스너
        //txt = (EditText) findViewById(R.id.editText);
        //  btn = (Button) findViewById(R.id.bt_speakOut);
//        btn.setEnabled(false);

//        btn.setOnClickListener(new View.OnClickListener(){
//
//            @Override
//            public void onClick(View view) {
//                speak();
//            }
//        });

        TimerTask tt = new TimerTask() {
            @Override
            public void run() {
                Log.e("1번태스크카운터:", "알림입니다 알림이에요~");
                //insertToDatabase(latitude,longitude);
                //https://molit-hackerton-2017-csxion.c9users.io/molit_v1.0/get_gps_process.php?lat=37.473&lon=127.038

                String link="https://molit-hackerton-2017-csxion.c9users.io/molit_v1.0/get_gps_process.php?lat="+latitude+"&lon="+longitude;
                Log.e("link입니다",link);
                getData(link); //gps 받아오는 getdata
            }
        };

        Timer timer = new Timer();
        timer.schedule(tt, 0, 1000);
//        tv = (TextView) findViewById(R.id.tv);
//        Animation anim = new AlphaAnirmation(0.0f, 1.0f);
//        anim.setDuration(400); //You can manage the time of the blink with this parameter
//        anim.setStartOffset(20);
//        anim.setRepeatMode(Animation.REVERSE);
//        anim.setRepeatCount(Animation.INFINITE);
//        tv.startAnimation(anim);

    }

    protected void showList() {
        try {
            //JSONObject jsonObj = new JSONObject(myJSON);
            JSONArray jsonary = new JSONArray(myJSON);
           // peoples = jsonObj.getJSONArray(TAG_RESULTS);
/*
            for (int i = 0; i < peoples.length(); i++) {
                JSONObject c = peoples.getJSONObject(i);
                String q1 = c.getString(TAG_LAT);
                String q2 = c.getString(TAG_LON);

            }*/

            for (int i = 0; i < jsonary.length(); i++)
            {
                JSONObject c = jsonary.getJSONObject(i);
                my_lat = c.getString(TAG_LAT);
                my_lon = c.getString(TAG_LON);
              //  Log.e("q1111111111" ,q1);
              //  Log.e("q222222222" ,q2);
            }

        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    protected void showList2() {
        try {
            JSONObject jsonObj = new JSONObject(myJSON);
            peoples = jsonObj.getJSONArray(TAG_RESULTS);

            for (int i = 0; i < peoples.length(); i++) {
                JSONObject c = peoples.getJSONObject(i);
                String q1 = c.getString(TAG_Q1);
                String q2 = c.getString(TAG_Q2);
                String q3 = c.getString(TAG_Q3);
                String q4 = c.getString(TAG_Q4);
                String q5 = c.getString(TAG_Q5);
                pr1.setProgress(Integer.parseInt(q1));
                pr2.setProgress(Integer.parseInt(q2));
                pr3.setProgress(Integer.parseInt(q3));
                String [] my_split1 = q4.split(":");
                String [] my_split2 = q5.split(":");
                for(int k=0; k<my_split1.length;k++)
                {
                    adapter.add(my_split1[k], "2017/0" + k + "/2" + k, Float.parseFloat(my_split2[k]));
                }
            }

        } catch (JSONException e) {
            e.printStackTrace();
        }
    }
    public void getData(String url){
        class GetDataJSON extends AsyncTask<String, Void, String> {
            @Override
            protected String doInBackground(String... params) {
                String uri = params[0];
                BufferedReader bufferedReader = null;
                try {
                    URL url = new URL(uri);
                    HttpURLConnection con = (HttpURLConnection) url.openConnection();
                    StringBuilder sb = new StringBuilder();

                    bufferedReader = new BufferedReader(new InputStreamReader(con.getInputStream()));

                    String json;
                    while((json = bufferedReader.readLine())!= null){
                        sb.append(json+"\n");
                    }

                    return sb.toString().trim();

                }catch(Exception e){
                    return null;
                }

            }

            @Override
            protected void onPostExecute(String result){
                myJSON=result;
                showList();
            }
        }
        GetDataJSON g = new GetDataJSON();
        g.execute(url);
    }
    public void getData2(String url){
        class GetDataJSON extends AsyncTask<String, Void, String> {
            @Override
            protected String doInBackground(String... params) {
                String uri = params[0];
                BufferedReader bufferedReader = null;
                try {
                    URL url = new URL(uri);
                    HttpURLConnection con = (HttpURLConnection) url.openConnection();
                    StringBuilder sb = new StringBuilder();

                    bufferedReader = new BufferedReader(new InputStreamReader(con.getInputStream()));

                    String json;
                    while((json = bufferedReader.readLine())!= null){
                        sb.append(json+"\n");
                    }

                    return sb.toString().trim();

                }catch(Exception e){
                    return null;
                }

            }

            @Override
            protected void onPostExecute(String result){
                myJSON=result;
                showList2();
            }
        }
        GetDataJSON g = new GetDataJSON();
        g.execute(url);
    }

    private void insertToDatabase(String lat, String lon){

        class InsertData extends AsyncTask<String, Void, String> {
            ProgressDialog loading;



            @Override
            protected void onPreExecute() {
                super.onPreExecute();
                loading = ProgressDialog.show(MainActivity.this, "Please Wait", null, true, true);
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

                    String lat = (String)params[0];
                    String lon = (String)params[1];

                    String link="http://yonwon01.cafe24.com/myun/insertout.php";
                    String data  = URLEncoder.encode("lat", "UTF-8") + "=" + URLEncoder.encode(lat, "UTF-8");
                    data += "&" +  URLEncoder.encode("lon", "UTF-8") + "=" + URLEncoder.encode(lon, "UTF-8");
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
        task.execute(lat,lon);
    }

    private void insertToDatabase2(String driver_id, String driver_name){

        class InsertData extends AsyncTask<String, Void, String> {
            ProgressDialog loading;



            @Override
            protected void onPreExecute() {
                super.onPreExecute();
                loading = ProgressDialog.show(MainActivity.this, "Please Wait", null, true, true);
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
                    String driver_name = (String)params[1];

                    String link="https://molit-hackerton-2017-csxion.c9users.io/molit_v1.0/eval_process.php";
                    String data  = URLEncoder.encode("driver_id", "UTF-8") + "=" + URLEncoder.encode(driver_id, "UTF-8");
                    data += "&" + URLEncoder.encode("driver_name", "UTF-8") + "=" + URLEncoder.encode(driver_name, "UTF-8");
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
        task.execute(driver_id,driver_name);
    }
    @Override
    protected void attachBaseContext(Context newBase){
        super.attachBaseContext(TypekitContextWrapper.wrap(newBase));
    }

    @Override
    public void onMapReady(GoogleMap map) {
        if(mGoogleMap==null)
            mGoogleMap = map;

        // ↑매개변수로 GoogleMap 객체가 넘어옵니다.
        Log.e("mymy","이게 무슨일이야 이렇게 좋은 날엔");
        // camera 좌쵸를 서울역 근처로 옮겨 봅니다.
        mGoogleMap.moveCamera(CameraUpdateFactory.newLatLng(
                new LatLng(37.555744, 126.970431)   // 위도, 경도
        ));

        // 구글지도(지구) 에서의 zoom 레벨은 1~23 까지 가능합니다.
        // 여러가지 zoom 레벨은 직접 테스트해보세요
        CameraUpdate zoom = CameraUpdateFactory.zoomTo(15);
        mGoogleMap.animateCamera(zoom);   // moveCamera 는 바로 변경하지만,
        // animateCamera() 는 근거리에선 부드럽게 변경합니다

        // marker 표시
        // market 의 위치, 타이틀, 짧은설명 추가 가능.
        MarkerOptions optFirst = new MarkerOptions();
        optFirst.position(new LatLng(37.555744, 126.970431));// 위도 ? 경도
        optFirst.icon(BitmapDescriptorFactory.fromResource(R.drawable.gps_bus));
        m =mGoogleMap.addMarker(optFirst);
        m.showInfoWindow();
//        marker = new MarkerOptions();
//        marker.position(new LatLng(37.555744, 126.970431))
//                .title("서울역")
//                .snippet("Seoul Station");
//        marker.icon(BitmapDescriptorFactory.fromResource(R.drawable.gps_bus));
//
//        map.addMarker(marker).showInfoWindow(); // 마커추가,화면에출력

        // 마커클릭 이벤트 처리
        // GoogleMap 에 마커클릭 이벤트 설정 가능.
//        map.setOnMarkerClickListener(new GoogleMap.OnMarkerClickListener() {
//            @Override
//            public boolean onMarkerClick(Marker marker) {
//                // 마커 클릭시 호출되는 콜백 메서드
//                Toast.makeText(getApplicationContext(),
//                        marker.getTitle() + " 클릭했음"
//                        , Toast.LENGTH_SHORT).show();
//                return false;
//            }
//        });
        GPS gps = new GPS(MainActivity.this);
        // GPS 사용유무 가져오기
        if (gps.isGetLocation()) {
            if (ActivityCompat.checkSelfPermission(MainActivity.this, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED
                    && ActivityCompat.checkSelfPermission(MainActivity.this, Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
                // TODO: Consider calling
                ;
            }

            locm.requestLocationUpdates(LocationManager.GPS_PROVIDER
                    , 1000
                    , 10,
                    li);    //1000*x는 초, 10은 m단위

            locm.requestLocationUpdates(LocationManager.NETWORK_PROVIDER,
                    1000,
                    10,
                    li);


        }
        else
        {
            Log.e("gps","실행안됨 에라이");
            gps.showAlert();
            locm.requestLocationUpdates(LocationManager.GPS_PROVIDER
                    , 1000
                    , 10,
                    li);    //1000*x는 초, 10은 m단위

            locm.requestLocationUpdates(LocationManager.NETWORK_PROVIDER,
                    1000,
                    10,
                    li);
        }
    }




    public static void Start(double lat, double lon, double speed)
    {
        // Creating a LatLng object for the current location
        System.out.println("여기야 여기야 여기라고");

        latitude = Double.toString(lat);
        longitude = Double.toString(lon);

        loc_a.setLatitude(lat);
        loc_a.setLongitude(lon);

//        loc_b.setLatitude(37.4705087);  //위험도로 위.경도
//        loc_b.setLongitude(127.0363128);
        System.out.println("구리구리뱅뱅 : "+loc_a.distanceTo(loc_b)/1000);
        if(lat>=100)
        {
            latitude=latitude.substring(0,7);
        }
        else if(lat>=10)
        {
            latitude=latitude.substring(0,6);
        }
        else
        {
            latitude=latitude.substring(0,5);
        }

        if(lon>=100)
        {
            longitude=longitude.substring(0,7);
        }
        else if(lat>=10)
        {
            longitude=longitude.substring(0,6);
        }
        else
        {
            longitude=longitude.substring(0,5);
        }
        System.out.println("이거다"+latitude+"//"+longitude);
        LatLng latLng = new LatLng(lat, lon);
        Double real_lat = 0.0;
        Double real_lon = 0.0;
        if(my_lat != null && my_lon !=null)
        {
            real_lat = Double.parseDouble(my_lat);
            real_lon = Double.parseDouble(my_lon);
        }
//            System.out.println("여기여기여기여기")
//        loc_b.setLatitude(37.473);  //위험도로 위.경도
//        loc_b.setLongitude(127.038);
//        LatLng my_ll = new LatLng(37.473,127.038);      //원의 좌표
        loc_b.setLatitude(real_lat);  //위험도로 위.경도
        loc_b.setLongitude(real_lon);
        LatLng my_ll = new LatLng(real_lat,real_lon);      //원의 좌표
        // Showing the current location in Google Map
        mGoogleMap.moveCamera(CameraUpdateFactory.newLatLng(latLng));
        // Map 을 zoom 합니다.
        mGoogleMap.animateCamera(CameraUpdateFactory.zoomTo(16));
        // 마커 설정.
        MarkerOptions optFirst = new MarkerOptions();
        optFirst.position(latLng);// 위도 ? 경도
        if(m != null)
        {
            m.remove();
        }
        optFirst.icon(BitmapDescriptorFactory.fromResource(R.drawable.gps_bus));

        // 반경 1KM원
        CircleOptions circle1KM = new CircleOptions().center(my_ll) //원점
                .radius(200)      //반지름 단위 : m
                .strokeWidth(0f)  //선너비 0f : 선없음
                .fillColor(Color.parseColor("#40FF0000")); //배경색

        //마커추가
//        this.googleMap.addMarker(mymarker);
        //원추가
        if(loc_a.distanceTo(loc_b)<=3000)
        {
            //여기에 tts 넣으면됨
            String text = "근방에 사고 위험도로가 있습니다.";
           // tts.setPitch((float) 0.1); //음량
            tts.setSpeechRate((float) 1.2); //재생속도
            tts.speak(text, TextToSpeech.QUEUE_FLUSH, null);
            mGoogleMap.clear();
            mGoogleMap.addCircle(circle1KM);
            m =mGoogleMap.addMarker(optFirst);
            m.showInfoWindow();
        }
        else
        {
            mGoogleMap.clear();
            m =mGoogleMap.addMarker(optFirst);
            m.showInfoWindow();
        }
        speed_txt.setText(String.valueOf((int)speed));
    }
    @Override
    protected void onDestroy() {
        if (tts != null) {
            tts.stop();
            tts.shutdown();
        }
        super.onDestroy();
    }
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if(hasFocus) {
            ani.start();
        } else {
            ani.reset();
        }
    }



    @Override
    public void onInit(int i) {
        if (i == TextToSpeech.SUCCESS) {
            int language = tts.setLanguage(Locale.KOREAN);

            if (language == TextToSpeech.LANG_MISSING_DATA || language == TextToSpeech.LANG_NOT_SUPPORTED) {
               // btn.setEnabled(false);
                Toast.makeText(this, "지원하지 않는 언어입니다.", Toast.LENGTH_SHORT).show();
            } else {
              //  btn.setEnabled(true);
               // speak();
            }
        } else {
            Toast.makeText(this, "TTS 실패!", Toast.LENGTH_SHORT).show();
        }
    }

    private void speak() {
        String text = "근방에 사고 위험도로가 있습니다.";
        tts.setPitch((float) 0.1); //음량
        tts.setSpeechRate((float) 0.5); //재생속도
        tts.speak(text, TextToSpeech.QUEUE_FLUSH, null);
    }





    @Override
    public void onConnected(@Nullable Bundle bundle) {

    }

    @Override
    public void onConnectionSuspended(int i) {

    }

    @Override
    public void onConnectionFailed(@NonNull ConnectionResult connectionResult) {

    }

    @Override
    public void onTabChanged(String s) {
        ani.start();
        Log.e("탭이 체인지됨", s);
        if(s.equals("Tab spec 1"))
        {
            Log.e("탭 1 이여", "탭 1");
            // tt = timerTaskMaker();
            //timer.schedule(tt, 0, 1000);

            //getData(link1);
        } //final Timer timer
        else{
            //tt.cancel();
            Log.e("탭 2 여 ", "탭 2");
            //getData(link);
        }
        pr1.startAnimation(ani);
        pr2.startAnimation(ani);
        pr3.startAnimation(ani);
    }
}
class      My_list extends BaseAdapter
{
    private ArrayList<list_item> list_items = new ArrayList<list_item>();

    public My_list()
    {
    }


    @Override
    public int getCount() {
        return list_items.size();
    }

    @Override
    public Object getItem(int i) {
        return list_items.get(i);
    }

    @Override
    public long getItemId(int i) {
        return i;
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        final int pos = position;
        final Context context = parent.getContext();

        // "listview_item" Layout을 inflate하여 convertView 참조 획득.
        if (convertView == null) {
            LayoutInflater inflater = (LayoutInflater) context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
            convertView = inflater.inflate(R.layout.list2, parent, false);
        }

        // 화면에 표시될 View(Layout이 inflate된)으로부터 위젯에 대한 참조 획득
        TextView comment_txt = (TextView) convertView.findViewById(R.id.passengercomment) ;
        TextView date_txt = (TextView) convertView.findViewById(R.id.passengerdate) ;
        RatingBar passenger_star = (RatingBar) convertView.findViewById(R.id.passengerstar);

        // Data Set(listViewItemList)에서 position에 위치한 데이터 참조 획득
        list_item listViewItem = list_items.get(position);

        // 아이템 내 각 위젯에 데이터 반영

        comment_txt.setText(listViewItem.getStr1());
        date_txt.setText(listViewItem.getStr2());
        passenger_star.setRating(listViewItem.getStar());

        return convertView;

    }

    public void add(String str1, String str2, float star)
    {
        list_item item = new list_item();

        item.setStr1(str1);
        item.setStr2(str2);
        item.setStar(star);
        list_items.add(item);
    }

}