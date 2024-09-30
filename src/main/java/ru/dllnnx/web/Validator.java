package ru.dllnnx.web;

import java.util.List;

public class Validator {
    private static final List<Float> validX = List.of(-2F, -1.5F, -1F, -0.5F, 0F, 0.5F, 1F, 1.5F, 2F);
    private static final List<Float> validR = List.of(1F, 1.5F, 2F, 2.5F, 3F);

    public static boolean validateCoordinates(Coordinates coord) {
        float x = coord.x(), y = coord.y(), r = coord.r();
        return validX.contains(x) && validR.contains(r) && -3 <= y && y <= 5;
    }
}
