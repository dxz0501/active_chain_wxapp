package cn.dimitri.active_chain.backend.po;

public class AcInfo {
    private long sid;
    private String wxUid;
    private String acType;
    private double acAmount;
    private String acNote;
    private String acDate;

    public long getSid() {
        return sid;
    }

    public void setSid(long sid) {
        this.sid = sid;
    }

    public String getWxUid() {
        return wxUid;
    }

    public void setWxUid(String wxUid) {
        this.wxUid = wxUid;
    }

    public double getAcAmount() {
        return acAmount;
    }

    public void setAcAmount(double acAmount) {
        this.acAmount = acAmount;
    }

    public String getAcNote() {
        return acNote;
    }

    public void setAcNote(String acNote) {
        this.acNote = acNote;
    }

    public String getAcDate() {
        return acDate;
    }

    public void setAcDate(String acDate) {
        this.acDate = acDate;
    }

    public String getAcType() {
        return acType;
    }

    public void setAcType(String acType) {
        this.acType = acType;
    }
}
