package cn.dimitri.active_chain.backend.dao;

import cn.dimitri.active_chain.backend.po.AcCoeff;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Result;
import org.apache.ibatis.annotations.Results;
import org.apache.ibatis.annotations.Select;
import org.springframework.stereotype.Component;

@Mapper
@Component
public interface AcCoeffMapr {
    @Results(
            id = "AC_COEFF", value = {
            @Result(property = "maleCoeff", column = "male_coeff"),
            @Result(property = "femaleCoeff", column = "female_coeff"),
            @Result(property = "fitCoeff", column = "fit_coeff"),
            @Result(property = "fatCoeff", column = "fat_coeff"),
            @Result(property = "fitFat", column = "fit_fat"),
            @Result(property = "needAuth", column = "need_auth")
    }
    )
    // 查询首条
    @Select("SELECT * FROM AC_COEFF LIMIT 1")
    AcCoeff selectOne();

}
