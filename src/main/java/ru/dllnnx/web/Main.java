package ru.dllnnx.web;

import com.fastcgi.FCGIInterface;
import java.nio.charset.StandardCharsets;
import java.util.Locale;
import java.util.Properties;
import java.util.StringTokenizer;

public class Main {
    private static final String RESPONSE_TEMPLATE = """
            Content-Type: application/json
            Access-Control-Allow-Origin: *
            Content-Length: %d

            %s""";

    public static void main(String[] args) {
        while (new FCGIInterface().FCGIaccept() >= 0) {
            try {
                String requestParams = FCGIInterface.request.params.getProperty("REQUEST_URI").split("\\?")[1];

                Coordinates coordinates = parseCoordinatesFromRequest(requestParams);

                sendJsonOK(String.format(Locale.US, "{\"result\": %b, \"x\": %f, \"y\": %f, \"r\": %f}",
                        checkArea(coordinates.x(), coordinates.y(), coordinates.r()),
                        coordinates.x(), coordinates.y(), coordinates.r()));

            } catch (NumberFormatException e) {
                sendJsonErr("{\"error\": \"wrong query param type\"}");
            } catch (NullPointerException e) {
                sendJsonErr("{\"error\": \"missed necessary query param\"}");
            } catch (Exception e) {
                sendJsonErr(String.format("{\"error\": %s}", e));
            }
        }
    }

    private static void sendJsonOK(String data) {
        System.out.printf((RESPONSE_TEMPLATE) + "%n", data.getBytes(StandardCharsets.UTF_8).length, data);
    }

    private static void sendJsonErr(String data) {
        System.out.printf((RESPONSE_TEMPLATE) + "%n", data.getBytes(StandardCharsets.UTF_8).length, data);
    }

    private static Coordinates parseCoordinatesFromRequest(String requestParams) {
        Properties params = new Properties();
        StringTokenizer tokenizer = new StringTokenizer(requestParams, "&");
        while (tokenizer.hasMoreTokens()) {
            String[] pair = tokenizer.nextToken().split("=");
            params.setProperty(pair[0], pair[1]);
        }

        float x = Float.parseFloat(params.getProperty("x"));
        float y = Float.parseFloat(params.getProperty("y"));
        float r = Float.parseFloat(params.getProperty("r"));
        return new Coordinates(x, y, r);
    }

    private static boolean checkArea(float x, float y, float r) {
        if (x < 0 && y < 0) {
            return false;
        }
        if (x > 0 && y > 0) {
            if ((x * x + y * y) > (r / 2) * (r / 2)) {
                return false;
            }
        }
        if (x >= 0 && y <= 0) {
            if (y < 2 * x - r) {
                return false;
            }
        }
        if (x <= 0 && y >= 0) {
            return (x >= -r) && (y <= r);
        }
        return true;
    }
}