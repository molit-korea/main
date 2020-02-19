package com.example.miyon.tts;

/**
 * Created by jinsu on 2017-08-28.
 */

public class list_item {
    private String str1;
    private String str2;
    private Float star;

    public void setStr1(String str)
    {
        str1 = str;
    }

    public void setStr2(String str)
    {
        str2 = str;
    }
    public void setStar(Float str)
    {
        star = str;
    }

    public String getStr1()
    {
        return this.str1;
    }
    public String getStr2()
    {
        return this.str2;
    }
    public Float getStar()
    {
        return this.star;
    }
}