import {Mixpanel} from 'mixpanel-react-native';
import {MIX_PANEL_TOKEN} from '../config';

const trackAutomaticEvents = true;

const mixpanel = new Mixpanel(MIX_PANEL_TOKEN, trackAutomaticEvents);

export default mixpanel;
