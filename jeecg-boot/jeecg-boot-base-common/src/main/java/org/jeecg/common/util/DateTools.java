package org.jeecg.common.util;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

/**
 * 日期时间工具类：格式化
 */
public class DateTools {
    private final static String format = "yyyy-MM-dd HH:mm:ss";

    /**
     * 描述：字符串转日期对象 <br/>
     */
    public final static String strToStr(String dateString, String format, String toFormat) {
        if (format == null) {
            format = "yyyy-MM-dd HH:mm:ss";
        }
        SimpleDateFormat formatter = new SimpleDateFormat(format);
        try {
            Date date = formatter.parse(dateString);
            return dateToString(date, toFormat);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * 描述：日期对象转字符串 <br/>
     */
    public final static String dateToString(Date date, String format) {
        SimpleDateFormat formatter = new SimpleDateFormat(format);
        String dateString = formatter.format(date);
        return dateString;
    }

    public final static String dateToString(Date date) {
        return dateToString(date, format);
    }

    /**
     * 时间数字毫秒
     */
    public final static String getNewYMDHmsS() {
        return dateToString(new Date(), "yyyyMMddHHmmssSSS");
    }

    public final static String dateToString() {

        return dateToString(new Date(), format);
    }


    /**
     * 描述：字符串转日期对象 <br/>
     */
    public final static Date stringToDate(String dateString, String format) {
        SimpleDateFormat formatter = new SimpleDateFormat(format);
        try {
            return formatter.parse(dateString);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * 描述：获取当前系统 - 纳秒 <br/>
     */
    public final static Long nanoTime() {
        return System.nanoTime();
    }

    /**
     * 根据开始时间和结束时间返回时间段内的时间集合
     */
    public final static List<Date> getDatesBetweenTwoDate(Date beginDate, Date endDate) {
        List<Date> lDate = new ArrayList<Date>();
        lDate.add(beginDate);// 把开始时间加入集合
        Calendar cal = Calendar.getInstance();
        // 使用给定的 Date 设置此 Calendar 的时间
        cal.setTime(beginDate);
        while (endDate.after(cal.getTime())) {
            // 根据日历的规则，为给定的日历字段添加或减去指定的时间量
            lDate.add(cal.getTime());
            cal.add(Calendar.DAY_OF_MONTH, 1);
        }
        // lDate.add(endDate);// 把结束时间加入集合
        return lDate;
    }

    /**
     * (1) Calendar转化为Date() Calendar cal=Calendar.getInstance(); Date()
     * date=cal.getTime();
     *
     * @param calendar
     * @return
     */
    public static Date getDateTimeWithCalendar(Calendar calendar) {
        Date date = calendar.getTime();
        return date;
    }

    /**
     * (2) Date转化为Calendar Date date=new Date(); Calendar
     * cal=Calendar.getInstance(); cal.setTime(date);
     */
    public static Calendar getCalendarWithDate(Date date) {
        Calendar cal = Calendar.getInstance();
        cal.setTime(date);
        return cal;
    }

    /**
     * 根据Date 日期 转换成字符串日月日
     */
    public static String getStringDateWithDate(Date date) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        String dataStr = "";
        try {
            dataStr = sdf.format(date);
        } catch (Exception e) {
//            logger.error("时间格式化异常", e);
        }
        return dataStr;
    }

    /**
     * 月份加减
     */
    public static String monthAddNum(String ym, Integer num) {
        Date date = stringToDate(ym, "yyyy-MM");
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.add(Calendar.MONTH, num);
        Date newTime = calendar.getTime();
        return dateToString(newTime, "yyyy-MM");
    }

    /**
     * 获得某个月最大天数
     */
    public static int getMaxDayByYearMonth(String ym) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(stringToDate(ym, "yyyy-MM"));
        return calendar.getActualMaximum(Calendar.DATE);

    }


    /**
     * 传入开始日期结束日期，获得集合（yyyy-MM-dd）
     */
    public static List<String> getDateStr(Date beginDate, Date endDate) {
        List<String> dateStr = new ArrayList<String>();
        Calendar calendar = DateTools.getCalendarWithDate(endDate);
        dateStr.add(DateTools.getStringDateWithDate(beginDate));

        while (calendar.getTime().after(beginDate)) {
            dateStr.add(DateTools.getStringDateWithDate(calendar.getTime()));
            calendar.add(Calendar.DATE, -1);
        }
        return dateStr;
    }

    /**
     * 通过时间秒毫秒数判断两个时间的间隔
     */
    public static int differentDaysByMillisecond(Date date1, Date date2) {
        int days = (int) ((date2.getTime() - date1.getTime()) / (1000 * 3600 * 24));
        return days;
    }

    /**
     * @param days
     */
    public static Date daysAdd(int days) {
        Date today = new Date();
        Calendar c = Calendar.getInstance();
        c.setTime(today);
        // 今天+days天
        c.add(Calendar.DAY_OF_MONTH, days);
        Date tomorrow = c.getTime();
        return tomorrow;
    }

    /**
     * 想要获取的日期与传入日期的差值 比如想要获取传入日期前四天的日期 day=-4即可
     */
    public static Date getSomeDay(Date date, int day) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.add(Calendar.DATE, day);
        return calendar.getTime();
    }

}
