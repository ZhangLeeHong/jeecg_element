package org.jeecg.common.util;


import java.text.DecimalFormat;

/**
 * 数字-工具类
 */
public class NumberTools {

    public final static String intToHex(Integer num) {
        String hex = Integer.toHexString(num);
        return hex;
    }

    public final static int random(int max) {
        return Integer.parseInt(format(Math.random() * max, "0"));
    }

    public final static double random() {
        return Math.random();
    }

    public final static String format(Object val, String format) {
        return new DecimalFormat(format).format(val);
    }

    public final static double toDouble(Object obj, Double defaultVal) {
        if (obj == null) {
            return defaultVal;
        }
        try {
            return Double.parseDouble(obj.toString().trim());
        } catch (Exception ex) {
            return defaultVal;
        }
    }

    public final static int toInt(Object obj, int defaultVal) {
        if (obj == null) {
            return defaultVal;
        }
        try {
            String str = obj.toString().trim();
            if (str.indexOf(".") > -1) {
                str = str.substring(0, str.indexOf("."));
            }
            return Integer.parseInt(str);
        } catch (Exception ex) {
            return defaultVal;
        }
    }

    public final static long toLong(Object obj, int defaultVal) {
        if (obj == null) {
            return defaultVal;
        }
        try {
            String str = obj.toString().trim();
            if (str.indexOf(".") > -1) {
                str = str.substring(0, str.indexOf("."));
            }
            return Long.parseLong(str);
        } catch (Exception ex) {
            return defaultVal;
        }
    }

}
