package com.vocalmart.util;

import java.math.BigDecimal;
import java.math.RoundingMode;

public final class Pricing {

    public static final BigDecimal FREE_SHIPPING_AT = new BigDecimal("999.00");
    public static final BigDecimal SHIPPING_FEE = new BigDecimal("49.00");

    private Pricing() {
    }

    public static BigDecimal money(BigDecimal value) {
        return value.setScale(2, RoundingMode.HALF_UP);
    }

    public static BigDecimal shippingFor(BigDecimal subtotal) {
        if (subtotal.compareTo(BigDecimal.ZERO) <= 0) {
            return money(BigDecimal.ZERO);
        }
        if (subtotal.compareTo(FREE_SHIPPING_AT) >= 0) {
            return money(BigDecimal.ZERO);
        }
        return SHIPPING_FEE;
    }

    public static String shippingNote() {
        return "Free shipping on orders of ₹999 and above. A flat ₹49 fee applies below that.";
    }
}
