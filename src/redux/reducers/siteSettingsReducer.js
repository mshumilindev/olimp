import {
  SITE_SETTINGS_BEGIN,
  SITE_SETTINGS_SUCCESS,
} from "../actions/siteSettingsActions";

const initialState = {
  siteSettingsList: null,
  loading: false,
};

export default function handleSiteSettings(state = initialState, action) {
  switch (action.type) {
    case SITE_SETTINGS_BEGIN:
      return {
        ...state,
        loading: true,
      };

    case SITE_SETTINGS_SUCCESS:
      return {
        ...state,
        loading: false,
        siteSettingsList: action.payload.siteSettingsList,
      };

    default:
      return state;
  }
}
