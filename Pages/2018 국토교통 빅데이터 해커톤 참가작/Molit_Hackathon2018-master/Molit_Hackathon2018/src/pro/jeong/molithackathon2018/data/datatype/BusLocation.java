package pro.jeong.molithackathon2018.data.datatype;

public class BusLocation {
    private String time;

    private String X;
    private String Y;
    private String angle;

    public BusLocation(String time, String X, String Y, String angle) {
        this.time = time;
        this.X = X;
        this.Y = Y;
        this.angle = angle;
    }

    public String getTime() {
        return time;
    }

    public String getX() {
        return X;
    }

    public String getY() {
        return Y;
    }

    public String getAngle() {
        return angle;
    }
}
