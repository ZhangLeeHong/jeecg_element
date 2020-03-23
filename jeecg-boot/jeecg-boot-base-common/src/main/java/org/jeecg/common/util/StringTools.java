package org.jeecg.common.util;


import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;


public class StringTools {

    public final static boolean isNullOrEmpty(Object obj) {
        if (obj == null || obj.toString().trim().length() == 0) {
            return true;
        }
        return false;
    }

    /**
     * 判断一组数据是不是为空，如果有一个为空，那就返回失败。
     *
     * @param objs
     * @return
     */
    public final static boolean isNullOrEmptyList(Object... objs) {
        for (Object obj : objs) {
            if (StringTools.isNullOrEmpty(obj)) {
                return true;
            }
        }
        return false;
    }

    /**
     * 首字母转大写
     *
     * @param str
     * @return
     */
    public static String toFirstUpperCase(String str) {
        String str1 = str.substring(0, 1).toUpperCase().concat(str.substring(1));
        return str1;
    }

    /**
     * 获取小写字母头
     *
     * @param str
     * @return
     */
    public static String getFirstLowerCase(String str) {
        String strTemp = "";
        for (int i = 0; i < str.length(); i++) {
            char ch = str.charAt(i);
            if (Character.isUpperCase(ch)) {
                return strTemp;
            }
            ;
            strTemp += ch;
        }
        return null;
    }

    /**
     * 去除字符窜中的特殊符号
     */
    public static String removeStr(String req) {
        //可以在中括号内加上任何想要替换的字符
        String regEx = "[\n`~!@#$%^&*()+=|{}':;',\\[\\].<>?~！@#￥%……&*（）——+|{}【】‘；：”“’。， 、？]";
        String aa = "";//这里是将特殊字符换为aa字符串,""代表直接去掉
        Pattern p = Pattern.compile(regEx);
        Matcher m = p.matcher(req);
        //这里把想要替换的字符串传进来
        String newString = m.replaceAll(aa).trim();
        return newString;
    }

    /**
     * 将数组list<string> 组装成in的sql返回
     *
     * @param idsList
     * @return
     */
    public static String ListStringToInSQL(List<String> idsList) {
        StringBuffer sb = new StringBuffer();
        sb.append("(");
        for (int i = 0; i < idsList.size(); i++) {
            sb.append("'");
            sb.append(idsList.get(i));
            sb.append("'");
            if (i < idsList.size() - 1) {
                sb.append(",");
            }
        }
        sb.append(")");
        return sb.toString();
    }
}
