package com.lanccj.model.base;

import com.jfinal.plugin.activerecord.Model;
import com.jfinal.plugin.activerecord.IBean;

/**
 * Generated by JFinal, do not modify this file.
 */
@SuppressWarnings({"serial", "unchecked"})
public abstract class BaseDemo<M extends BaseDemo<M>> extends Model<M> implements IBean {

	public M setId(java.lang.Integer id) {
		set("id", id);
		return (M)this;
	}

	public java.lang.Integer getId() {
		return get("id");
	}

	public M setCol1(java.lang.String col1) {
		set("col1", col1);
		return (M)this;
	}

	public java.lang.String getCol1() {
		return get("col1");
	}

	public M setCol2(java.lang.String col2) {
		set("col2", col2);
		return (M)this;
	}

	public java.lang.String getCol2() {
		return get("col2");
	}

	public M setCol3(java.lang.String col3) {
		set("col3", col3);
		return (M)this;
	}

	public java.lang.String getCol3() {
		return get("col3");
	}

}
