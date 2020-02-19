package pro.jeong.molithackathon2018.core.tripVisualizer;

import pro.jeong.molithackathon2018.data.datatype.Bus;

public class Visualizer {
    // GOOGLE MAPS API : AIzaSyD13Ez7i4xfcT-pWQWW3hXyjU-RyxyCYco
    private Bus bus = null;

    private TripVisualizerFrame frame = null;
    private TripVisualizerPanel panel = null;

    public Visualizer(Bus bus) {
        this.bus = bus;
        this.panel = new TripVisualizerPanel(bus);
    }

    public void visualizeBus() {
        this.frame = new TripVisualizerFrame(panel);
    }
}
