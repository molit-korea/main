package com.example.miyon.tts;

import android.app.Activity;
import android.content.Intent;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.pm.Signature;
import android.os.Bundle;
import android.os.Handler;
import android.util.Log;

import com.kakao.auth.ErrorCode;
import com.kakao.auth.ISessionCallback;
import com.kakao.auth.Session;
import com.kakao.auth.helper.Base64;
import com.kakao.network.ErrorResult;
import com.kakao.usermgmt.UserManagement;
import com.kakao.usermgmt.callback.LogoutResponseCallback;
import com.kakao.usermgmt.callback.MeResponseCallback;
import com.kakao.usermgmt.response.model.UserProfile;
import com.kakao.util.exception.KakaoException;
import com.kakao.util.helper.log.Logger;

import java.security.MessageDigest;
//자동 임포트 단축키 : ctrl+shift+o

public class login extends Activity {
    SessionCallback callback;


    public static boolean first = true; //처음 앱 실행시에만 커버가 뜨게하는 변수 , 홈버튼으로 메인화면올시에는 커버 안뜨게
   String userProfile2;
    long userProfile1;
    /////////////



    public String uri;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // setContentView(R.layout.activity_main);// activity_main의 화면을 불러오는 함수

        try{
            PackageInfo info = getPackageManager().getPackageInfo(this.getPackageName(), PackageManager.GET_SIGNATURES);
            for(Signature signature : info.signatures){
                MessageDigest messageDigest = MessageDigest.getInstance("SHA");

                messageDigest.update(signature.toByteArray());

                Log.d("aaaa", Base64.encodeBase64URLSafeString(messageDigest.digest()));}
        } catch (Exception e){
            Log.d("error", "PackageInfo error is " + e.toString());
}

            // 두번째 실행될때 메인화면을 띄운다.

            //first = true;

            setContentView(R.layout.kakao_login);

            /**카카오톡 로그아웃 요청**/
            //한번 로그인이 성공하면 세션 정보가 남아있어서 로그인창이 뜨지 않고 바로 onSuccess()메서드를 호출합니다.
            //테스트 하시기 편하라고 매번 로그아웃 요청을 수행하도록 코드를 넣었습니다 ^^*/


            UserManagement.requestLogout(new LogoutResponseCallback() {
                @Override
                public void onCompleteLogout() {
                    //로그아웃 성공 후 하고싶은 내용 코딩 ~
                }
            });


        callback = new SessionCallback();
        Session.getCurrentSession().addCallback(callback);
        Session.getCurrentSession().checkAndImplicitOpen();
    }

    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        //간편로그인시 호출 ,없으면 간편로그인시 로그인 성공화면으로 넘어가지 않음
        if (Session.getCurrentSession().handleActivityResult(requestCode, resultCode, data)) {
            return;
        }
        super.onActivityResult(requestCode, resultCode, data);
    }




    private class SessionCallback implements ISessionCallback {

        @Override
        public void onSessionOpened() {

            UserManagement.requestMe(new MeResponseCallback() {

                public void onFailure(ErrorResult errorResult) {
                    String message = "failed to get user info. msg=" + errorResult;
                    Logger.d(message);

                    ErrorCode result = ErrorCode.valueOf(errorResult.getErrorCode());
                    if (result == ErrorCode.CLIENT_ERROR_CODE) {
                        finish();
                    } else {
                        //redirectMainActivity();
                    }
                }

                @Override
                public void onSessionClosed(ErrorResult errorResult) {
                    Log.e("close","close");
                }

                @Override
                public void onNotSignedUp() {
                }


                @Override
                public void onSuccess(UserProfile userProfile) {
                    //로그인에 성공하면 로그인한 사용자의 일련번호, 닉네임, 이미지url등을 리턴합니다.
                    //사용자 ID는 보안상의 문제로 제공하지 않고 일련번호는 제공합니다.
                    Log.e("UserProfile", userProfile.toString());
                    System.out.println(userProfile.getNickname());
                    Intent i = new Intent(login.this, MainActivity.class);

                    userProfile1=userProfile.getId();
                    userProfile2=userProfile.getNickname();
                    //i.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
                    i.putExtra("profile1",userProfile1);
                    i.putExtra("profile2", userProfile2);

                    System.out.println("Ddddddddddddddddddddddddddddddddddddd"+userProfile1);
                    System.out.println("Ddddddddddddddddddddddddddddddddddddd"+userProfile2);

                    startActivity(i);
                    finish();
                }
            });

        }

        @Override
        public void onSessionOpenFailed(KakaoException exception) {
            // 세션 연결이 실패했을때
            Log.d("test","실패");
            Logger.e(exception);

        }

    }



}

