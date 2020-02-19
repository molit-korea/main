package com.company;

/**
 * Created by Sunpil on 2018-06-07.
 */
public class Vertex {
    public double latitude;
    public double longitude;

    public Vertex(double latitude, double longitude) {
        this.latitude = latitude * 1000000;
        this.longitude = longitude * 1000000;
    }
}
