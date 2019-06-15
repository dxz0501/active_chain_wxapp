package cn.dimitri.active_chain.backend.dao;

import cn.dimitri.active_chain.backend.po.WxUser;
import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Component;

import java.util.List;

@Mapper
@Component
public interface WxUserMapr {
    @Results(
            id = "WX_USER", value = {
            @Result(property = "wxUid", column = "wx_uid"),
            @Result(property = "wxNickname", column = "wx_nickname"),
            @Result(property = "uNickname", column = "u_nickname"),
            @Result(property = "uGender", column = "u_gender"),
            @Result(property = "uWeight", column = "u_weight"),
            @Result(property = "uPrivacy", column = "u_privacy")
    }
    )
    // 查询一个
    @Select("SELECT * FROM WX_USER WHERE wx_uid = #{uid}")
    WxUser selectOne(String uid);

    @ResultMap("WX_USER")
    @Select("SELECT * FROM WX_USER")
    List<WxUser> selectAll();

    @Insert("INSERT INTO WX_USER VALUES(#{wxUid}, #{wxNickName}, #{uNickname}, #{uGender}, #{uWeight}, #{uPrivacy})")
    int insertUser(WxUser wxUser);

    @Update("UPDATE WX_USER SET wx_nickname = #{wxNickName}, " +
            " u_nickname = #{uNickname}, " +
            " u_gender = #{uGender}, " +
            " u_weight = #{uWeight}, " +
            " u_privacy = #{uPrivacy}, " +
            " WHERE wx_uid = #{wxUid}")
    int updateUser(WxUser wxUser);
}
