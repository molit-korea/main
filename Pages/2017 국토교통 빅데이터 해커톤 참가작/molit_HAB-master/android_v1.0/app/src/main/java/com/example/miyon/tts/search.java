package com.example.miyon.tts;

import android.content.Context;
import android.os.Bundle;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.RatingBar;
import android.widget.TextView;

import com.tsengvn.typekit.TypekitContextWrapper;

public class search extends AppCompatActivity {

    View actionbar;
    EditText search_bus;
    RatingBar ratingBar;
    LinearLayout layout;

    @Override
    protected void attachBaseContext(Context newBase){
        super.attachBaseContext(TypekitContextWrapper.wrap(newBase));
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.searchbus);

        ActionBar actionBar = getSupportActionBar();

        // Custom Actionbar를 사용하기 위해 CustomEnabled을 true 시키고 필요 없는 것은 false 시킨다
        actionBar.setDisplayShowCustomEnabled(true);
        actionBar.setDisplayHomeAsUpEnabled(false);            //액션바 아이콘을 업 네비게이션 형태로 표시합니다.
        actionBar.setDisplayShowTitleEnabled(false);        //액션바에 표시되는 제목의 표시유무를 설정합니다.
        actionBar.setDisplayShowHomeEnabled(false);            //홈 아이콘을 숨김처리합니다.


        //layout을 가지고 와서 actionbar에 포팅을 시킵니다.
        LayoutInflater inflater = (LayoutInflater)getSystemService(LAYOUT_INFLATER_SERVICE);
        actionbar = inflater.inflate(R.layout.custom_actionbar, null);

        actionBar.setCustomView(actionbar);

        //액션바 양쪽 공백 없애기
        Toolbar parent = (Toolbar)actionbar.getParent();
        parent.setContentInsetsAbsolute(0,0);

        search_bus =(EditText) findViewById(R.id.search_bus);
        ratingBar = (RatingBar)findViewById(R.id.totalstar);
        layout = (LinearLayout)findViewById(R.id.listlayout);

        search_bus.setOnKeyListener(new View.OnKeyListener() {
            @Override
            public boolean onKey(View v, int keyCode, KeyEvent event) {
                //Enter key Action
                if ((event.getAction() == KeyEvent.ACTION_DOWN) && (keyCode == KeyEvent.KEYCODE_ENTER)) {
                    //Enter키눌렀을떄 처리
                    layout.setVisibility(View.VISIBLE);
                    TextView bus_num = (TextView) findViewById(R.id.bus_num);
                    bus_num.setText(search_bus.getText());
                    ratingBar.setRating(3);
                    return true;
                }
                return false;
            }
        });
    }
    public void search(View view){ //여기에 조회랑 출력 다 해야함..어케하지????? 조회까지는 됨. 출력이 문제여 어케하쥐 어케하쥐....
        layout.setVisibility(View.VISIBLE);
        TextView bus_num = (TextView) findViewById(R.id.bus_num);
        bus_num.setText(search_bus.getText());
        ratingBar.setRating(3);

    }



}