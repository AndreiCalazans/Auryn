
package tv.youi;

import android.app.Application;
import youi.module.Orientation;

public class AurynApplication extends Application {
    private static AurynApplication instance;
    public static AurynApplication getInstance() {
        return instance;
    }
    @Override
    public void onCreate() {
        super.onCreate();

        Orientation.createInstance(this);
        instance = this;
    }
}
