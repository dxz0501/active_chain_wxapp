package cn.dimitri.active_chain.backend.biz;

import cn.dimitri.active_chain.backend.dao.WxUserMapr;
import cn.dimitri.active_chain.backend.po.WxUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final WxUserMapr dao;

    @Autowired
    public UserService(WxUserMapr dao) {
        this.dao = dao;
    }

    public WxUser selectUser(String uid) {
        WxUser user = dao.selectOne(uid);
        return user;
    }

    public boolean insertOrUpdateUser(WxUser user) {
        if (user == null) return false;
        String uid = user.getWxUid().trim();
        if (uid.length() == 0) return false;
        if (selectUser(uid) == null) {
            return dao.insertUser(user) > 0;
        }else{
            return dao.updateUser(user) > 0;
        }
    }
}
