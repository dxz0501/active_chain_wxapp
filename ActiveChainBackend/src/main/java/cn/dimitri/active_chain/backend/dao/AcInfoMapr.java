package cn.dimitri.active_chain.backend.dao;

import cn.dimitri.active_chain.backend.po.AcInfo;
import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Component;

import java.util.List;

@Mapper
@Component
public interface AcInfoMapr {
    @Results(
            id = "AC_INFO", value = {
            @Result(property = "sid", column = "sid"),
            @Result(property = "wxUid", column = "wx_uid"),
            @Result(property = "acType", column = "ac_type"),
            @Result(property = "acAmount", column = "ac_amount"),
            @Result(property = "acNote", column = "ac_note"),
            @Result(property = "acDate", column = "ac_date")
    }
    )
    // 带条件查询
    @Select("SELECT * FROM AC_INFO WHERE wx_uid = #{uid} AND ac_date >= #{sdate} AND ac_date <= #{tdate}")
    List<AcInfo> selectRecords(@Param("uid") String uid, @Param("sdate") String sdate, @Param("tdate") String tdate);

    @Insert("INSERT INTO AC_INFO(wx_uid, ac_type, ac_amount, ac_note, ac_date) " +
            "values(#{wxUid}, #{acType}, #{acAmount}, #{acNote}, #{acDate})")
    int insertInfo(AcInfo acInfo);

    @Delete("DELETE FROM AC_INFO WHERE sid = #{sid}")
    int deleteInfo(@Param("sid") long sid);
}
