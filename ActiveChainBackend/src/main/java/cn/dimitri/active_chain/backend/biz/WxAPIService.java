package cn.dimitri.active_chain.backend.biz;

import cn.dimitri.active_chain.backend.vo.WxUserSession;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class WxAPIService {
    @Autowired
    private RestTemplate restTemplate;

    public final static String APPID = "wx5b455f3a9165c202";
    public final static String APPSEC = "146017424615492481dca02b080be477";

    public WxUserSession handleUserSessionCode(String userCode){
        String uri = "https://api.weixin.qq.com/sns/jscode2session?appid="+APPID+"&secret="+APPSEC+"&js_code="+userCode+"&grant_type=authorization_code";
        ResponseEntity<String> respString = restTemplate.getForEntity(uri, String.class);
        ObjectMapper objectMapper = new ObjectMapper();
        WxUserSession resp = null;
        String strBody = null;
        if (respString.getStatusCodeValue() == 200) {
            strBody = respString.getBody();
        }
        try {
            resp = objectMapper.readValue(strBody, WxUserSession.class);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return resp;
    }
}
