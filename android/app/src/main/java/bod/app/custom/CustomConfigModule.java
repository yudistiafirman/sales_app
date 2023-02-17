package bod.app.custom;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;

import java.util.HashMap;
import java.util.Map;

import bod.app.BuildConfig;

public class CustomConfigModule extends ReactContextBaseJavaModule {
    CustomConfigModule(ReactApplicationContext context) {
        super(context);
    }

    @Override
    public String getName() {
        return "RNCustomConfig";
    }

    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        constants.put("flavor", BuildConfig.FLAVOR);
        constants.put("version_name", BuildConfig.VERSION_NAME);
        return constants;
    }
}
