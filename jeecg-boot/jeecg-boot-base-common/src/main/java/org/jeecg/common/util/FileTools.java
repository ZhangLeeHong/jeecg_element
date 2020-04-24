package org.jeecg.common.util;

import com.sun.org.apache.xml.internal.security.exceptions.Base64DecodingException;
import com.sun.org.apache.xml.internal.security.utils.Base64;
import org.apache.commons.io.FileUtils;
import sun.misc.BASE64Decoder;

import java.io.*;
import java.math.BigInteger;
import java.nio.MappedByteBuffer;
import java.nio.channels.FileChannel;
import java.security.MessageDigest;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

public class FileTools extends FileUtils {
    public static void createDir(String path) {
        try {
            path = path.replaceAll("/", "\\\\");
            String[] pahts = path.split("\\\\");
            String pstr = pahts[0];
            for (int i = 1; i < pahts.length - 1; i++) {
                pstr += "\\" + pahts[i];
                File file = new File(pstr);
                // 如果文件夹不存在则创建
                if (!file.exists() && !file.isDirectory()) {
                    file.mkdir();
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

    }

    public static boolean saveBase64Img(String baseImg, String saveImgPath) throws Base64DecodingException {
        //定义一个正则表达式的筛选规则，为了获取图片的类型
//        String rgex = "data:image/(.*?);base64";
//        String type = getSubUtilSimple(baseImg, rgex);
        //去除base64图片的前缀
        baseImg = baseImg.replaceFirst("data:(.+?);base64,", "");
        byte[] b;
        byte[] bs;
        OutputStream os = null;
        String fileName = "";
        String nowDate = "";
        // 格式化并获取当前日期（用来命名）

        //把图片转换成二进制
        b = Base64.decode(baseImg.replaceAll(" ", "+"));
        //生成路径
        String path = saveImgPath;
        //随机生成图片的名字，同时根据类型结尾
//        fileName = UUID.randomUUID().toString() + "." + type;
        File file = new File(path);
//        if (!file.exists() && !file.isDirectory()) {
//            file.mkdirs();
//        }
        File imageFile = new File(path);
        BASE64Decoder d = new BASE64Decoder();
        // 保存
        try {
            bs = d.decodeBuffer(Base64.encode(b));
            os = new FileOutputStream(imageFile);
            os.write(bs);
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();

        } finally {
            if (os != null) {
                try {
                    os.close();
                } catch (IOException e) {
                    e.getLocalizedMessage();
                }
            }
        }

        return true;
    }

    public static void ZipFile(String filepath, String zippath) {
        try {
            File file = new File(filepath);
            File zipFile = new File(zippath);
            InputStream input = new FileInputStream(file);
            ZipOutputStream zipOut = new ZipOutputStream(new FileOutputStream(zipFile));
            zipOut.putNextEntry(new ZipEntry(file.getName()));
            int temp = 0;
            while ((temp = input.read()) != -1) {
                zipOut.write(temp);
            }
            input.close();
            zipOut.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static boolean writeFile(String fileName, String str) {
        try {
            String path = fileName;
            File file = new File(path);

            createDir(path);
            FileOutputStream out = new FileOutputStream(file, false); // 如果追加方式用true
            StringBuffer sb = new StringBuffer();
            out.write(str.getBytes());// 注意需要转换对应的字符集
            out.close();
            return true;
        } catch (IOException ex) {

        }
        return false;
    }

    public static String getMd5ByFile(File file) {
        try {
            String value = null;
            FileInputStream in = new FileInputStream(file);
            try {
                MappedByteBuffer byteBuffer = in.getChannel().map(FileChannel.MapMode.READ_ONLY, 0, file.length());
                MessageDigest md5 = MessageDigest.getInstance("MD5");
                md5.update(byteBuffer);
                BigInteger bi = new BigInteger(1, md5.digest());
                value = bi.toString(16);
                bi = null;
                md5 = null;
                byteBuffer = null;
            } catch (Exception e) {
                value = file.length() + "";
                e.printStackTrace();
            }
            try {
                in.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
            System.gc();
            return value;
        } catch (Exception e) {
            System.gc();
            e.printStackTrace();
            return file.length() + "";
        }
    }

    public static String readTxtFile(String filePath) {
        String encoding = "GBK";
        return readTxtFile(filePath, encoding);
    }

    public static String readTxtFile(String filePath, String encoding) {
        try {
            File file = new File(filePath);
            if (file.isFile() && file.exists()) { // 判断文件是否存在
                InputStreamReader read = new InputStreamReader(
                        new FileInputStream(file), encoding);// 考虑到编码格式
                BufferedReader bufferedReader = new BufferedReader(read);
                String lineTxt = null;
                String txt = "";
                while ((lineTxt = bufferedReader.readLine()) != null) {
                    txt += lineTxt + "\n";
                }
                read.close();
                return txt;
            } else {

            }
        } catch (Exception e) {
            // ExceptionUtil.run(e,false);

        }
        return null;
    }

    public static boolean delFile(String filePath) {
        try {
            System.gc();
            File myDelFile = new File(filePath.toString());
            int num = 0;
            boolean del = myDelFile.delete();
            while (!del && num < 30) {
                System.gc();
                Thread.sleep(10);
                del = myDelFile.delete();
            }
            if (!del) {

            }
            return del;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public static void deleteAllFilesOfDir(File path) {
        if (!path.exists())
            return;
        if (path.isFile()) {
            int num = 0;
            while (!path.delete() && num < 5) {
                System.gc();
            }
            path.delete();
            return;
        }
        File[] files = path.listFiles();
        for (int i = 0; i < files.length; i++) {
            deleteAllFilesOfDir(files[i]);
        }
        System.gc();
        path.delete();
        System.gc();
    }


}
