package pro.jeong.molithackathon2018.core.tripVisualizer;

import javax.imageio.ImageIO;
import javax.swing.*;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;

public class TripVisualizerFrame extends JFrame {
    TripVisualizerPanel panel = null;
    boolean showVisualRoute = false;

    TripVisualizerFrame(TripVisualizerPanel panel) {
        this.panel = panel;
        setSize(new Dimension(panel.getWidth(), panel.getHeight()));
        setLayout(new BorderLayout());


        add(panel, BorderLayout.CENTER);
        BufferedImage image = getScreenShot(panel); // Takes a screen shot.
        saveImageToFile(image);

        setVisible(false);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
    }

    private void saveImageToFile(BufferedImage image) {
        File outputFile = new File(panel.bus.getTripID() + "_Img.jpeg");
        try {
            ImageIO.write(image, "jpeg", outputFile);
        } catch(IOException e) {
            e.printStackTrace();
        }

    }

    private BufferedImage getScreenShot(Component component) {
        BufferedImage image = new BufferedImage(panel.getWidth(), panel.getHeight(), BufferedImage.TYPE_INT_RGB);
        // paints into image's Graphics
        image.getGraphics().drawImage(image, 0, 0, Color.BLACK, null);
        component.paint(image.getGraphics());
        return image;
    }
}
