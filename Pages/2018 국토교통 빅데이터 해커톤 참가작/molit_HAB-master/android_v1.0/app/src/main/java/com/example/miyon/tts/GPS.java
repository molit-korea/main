package com.example.miyon.tts;

import android.Manifest;
import android.app.AlertDialog;
import android.app.Service;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.location.Address;
import android.location.Geocoder;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Bundle;
import android.os.IBinder;
import android.provider.Settings;
import android.support.annotation.Nullable;
import android.support.v4.app.ActivityCompat;
import android.util.Log;

import java.io.IOException;
import java.util.List;

/**
 * Created by jinsu on 2017-08-26.
 */

public class GPS extends Service implements LocationListener {
    double speed=0;
    long start_time=-1;
    private Context mContext = null;
    boolean isGPS = false;  //GPS 사용유뮤
    boolean isNetwork = false;  //네트워크 연결유뮤
    boolean isGetLocation = false;  //GPS 상태값
    Location before_loc;
    // private Marker m = null;

    Location loc;
    double lat; //위도
    double lon; //경도
    private static final long min_distance = 5;     //GPS 정보 업데이트 거리 5미터
    private static final long min_time = 1000 * 30;   //GPS 정보 업데이트 시간 30초

    protected LocationManager locm;
    final Geocoder geo = new Geocoder(this);
    private List<Address> list = null;


    public GPS(Context cntx) {
        this.mContext = cntx;
        getLocation();
    }


    public Location getLocation() {
        try {
            locm = (LocationManager) mContext.getSystemService(LOCATION_SERVICE);
            //locm = (LocationManager)getSystemService(Context.LOCATION_SERVICE);
            isGPS = locm.isProviderEnabled(LocationManager.GPS_PROVIDER);   //GPS 정보 가져오기
            isNetwork = locm.isProviderEnabled(LocationManager.NETWORK_PROVIDER);   //현재 네트워크 값 가져오기

            if (!isGPS && !isNetwork) {
                Log.e("gps","왜 못받냐"); ;
            } else {
                this.isGetLocation = true;

                // 네트워크 정보로 부터 위치값 가져오기
                if (isNetwork) {
                    Log.e("gps", "여기는오자");
                    if (ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
                        // TODO: Consider calling
                        //    ActivityCompat#requestPermissions
                        // here to request the missing permissions, and then overriding
                        //   public void onRequestPermissionsResult(int requestCode, String[] permissions,
                        //                                          int[] grantResults)
                        // to handle the case where the user grants the permission. See the documentation
                        // for ActivityCompat#requestPermissions for more details.
                        Log.e("gps", "실패");
                        return loc;
                    }
                    Log.e("gps", "여기는오자!!!!!!");
                    locm.requestLocationUpdates(
                            LocationManager.NETWORK_PROVIDER,
                            min_time,
                            min_distance, this
                    );
                    //  if(locm != null)
                    //  {
                    //  Log.e("gps", "locm은 널이아니다");
                    loc = locm.getLastKnownLocation(LocationManager.NETWORK_PROVIDER);
                    if(loc != null)
                    {
                        lat = loc.getLatitude();
                        lon = loc.getLongitude();
                        Log.e("gps", "위도 : "+lat+" "+"경도 : "+ lon);
                    }
                    // }

                }

                if(isGPS)
                {
                    if(loc == null)
                    {
                        locm.requestLocationUpdates(
                                LocationManager.GPS_PROVIDER,
                                min_time,
                                min_distance,this
                        );
                        // if(locm != null)
                        // {
                        loc = locm.getLastKnownLocation(LocationManager.GPS_PROVIDER);
                        if(loc != null)
                        {
                            lat = loc.getLatitude();
                            lon = loc.getLongitude();
                            Log.e("gps", "위도 : "+lat+" "+"경도 : "+ lon);
                        }
                        //   }
                    }
                }
            }
        }
        catch(Exception e)
        {
            e.printStackTrace();
        }
        return loc;
    }

    /**
     * GPS 종료
     * */
    public void stopUsingGPS()
    {
        if(locm != null)
        {
            locm.removeUpdates(GPS.this);
        }
    }

    /**
     * 위도값을 가져옵니다.
     * */
    public double getLatitude()
    {
        if(loc != null)
        {
            Log.e("gps", "위도 : "+lat+" "+"경도 : "+ lon);
            lat = loc.getLatitude();
        }
        return lat;
    }

    /**
     * 경도값을 가져옵니다.
     * */
    public double getLongitude()
    {
        if(loc != null)
        {
            lon = loc.getLongitude();
        }
        return lon;

    }

    /**
     * GPS 나 wife 정보가 켜져있는지 확인합니다.
     * */
    public boolean isGetLocation()
    {
        return this.isGetLocation;
    }

    /**
     * GPS 정보를 가져오지 못했을때
     * 설정값으로 갈지 물어보는 alert 창
     * */
    public void showAlert()
    {
        AlertDialog.Builder alert = new AlertDialog.Builder(mContext);
        alert.setTitle("GPS를 키세요");
        alert.setMessage("GPS를 셋팅하지 않으면 안됩니다.\n   설정창으로 가겠습니까?");

        //'네' 버튼
        alert.setPositiveButton("네", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialogInterface, int i) {
                Intent intent = new Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS);
                mContext.startActivity(intent);
            }
        });
        //'아니오' 버튼
        alert.setNegativeButton("아니오", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialogInterface, int i) {
                dialogInterface.cancel();
            }
        });
        alert.show();
    }


    @Override
    public void onLocationChanged(Location loc)
    {

        double m_speed;
        m_speed = speed;
        if(loc != null)
        {
            speed = loc.getSpeed();
        }
        if(start_time == -1)
        {
            start_time = loc.getTime();
        }
        float distance[] = new float[1];
        if(before_loc != null ) {
            Location.distanceBetween(before_loc.getLatitude(), before_loc.getLongitude(),
                    loc.getLatitude(), loc.getLongitude(), distance);
        }
        long delay = loc.getTime() - start_time;
        double r_speed = distance[0]/delay;
        r_speed = r_speed*3.6;
        speed = 3.6*speed;

        m_speed = (speed - m_speed)/delay;
        double lat = loc.getLatitude(); //위도
        double lon = loc.getLongitude();    //경도
        double al = loc.getAltitude();  //고도
        try {
            list = geo.getFromLocation(
                    lat,
                    lon,
                    10
            );
        } catch (IOException e) {
            e.printStackTrace();
        }
        if(list != null)
        {
            if(list.size()==0)
            {
//                Navigation.addr_txt.setText("해당되는 주소가 없습니다.");
            }
            else
            {
//                Navigation.addr_txt.setText(list.get(0).getAddressLine(0).toString());
            }
        }


        MainActivity.Start(lat,lon,speed);


//        // Creating a LatLng object for the current location
//        LatLng latLng = new LatLng(lat, lon);
//        // Showing the current location in Google Map
//        MainActivity.mGoogleMap.moveCamera(CameraUpdateFactory.newLatLng(latLng));
//        // Map 을 zoom 합니다.
//        MainActivity.mGoogleMap.animateCamera(CameraUpdateFactory.zoomTo(17));
//        // 마커 설정.
//        MarkerOptions optFirst = new MarkerOptions();
//        optFirst.position(latLng);// 위도 • 경도

//        if(list != null) {
//            if (list.size() == 0) {
//                optFirst.title("해당되는 주소가 없습니다.");
////                Navigation.addr_txt.setText("해당되는 주소가 없습니다.");
//            } else {
//                optFirst.title(list.get(0).getAddressLine(0).toString());
////                Navigation.addr_txt.setText(list.get(0).getAddressLine(0).toString());
//            }
//        }
        //optFirst.snippet("Snippet");

//        if(m != null)
//        {
//            m.remove();
//        }
//        optFirst.icon(BitmapDescriptorFactory.fromResource(R.drawable.gps_bus));
//        m =MainActivity.mGoogleMap.addMarker(optFirst);
//        m.showInfoWindow();
//        MainActivity.speed_txt.setText(String.valueOf((int)speed));

//        Navigation.lat_txt.setText("현재 위도 : "+lat);
//        Navigation.lon_txt.setText("현재 경도 : "+lon);
//        Navigation.al_txt.setText("현재 고도 : "+al);
//
//        Navigation.speed_txt.setText("현재 스피드 : "+(int)speed);
//        Navigation.rs_txt.setText("이거일수도 : "+ (int)r_speed);
//        Navigation.acc_txt.setText("가속도 : "+m_speed);
        before_loc = loc;
    }

    @Override
    public void onStatusChanged(String s, int i, Bundle bundle) {

    }

    @Override
    public void onProviderEnabled(String s) {

    }

    @Override
    public void onProviderDisabled(String s) {

    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }
}