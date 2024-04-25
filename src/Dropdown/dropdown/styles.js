import { StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({
  accessory: {
    width: 35,
    height: 34,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection:"row",
    position:"absolute",
    right:0,
    top:14
  },
  separator: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#8E8E8E"
  },
  triangle: {
    width: 8,
    height: 8,
    transform: [{
      translateY: -4,
    }, {
      rotate: '45deg',
    }],
  },

  triangleContainer: {
    width: 12,
    height: 6,
    overflow: 'hidden',
    alignItems: 'center',

    backgroundColor: 'transparent', /* XXX: Required */
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
  },

  picker: {
    backgroundColor: 'rgba(255, 255, 255, 1.0)',
    borderRadius: 2,

    position: 'absolute',

    ...Platform.select({
      ios: {
        shadowRadius: 2,
        shadowColor: 'rgba(0, 0, 0, 1.0)',
        shadowOpacity: 0.54,
        shadowOffset: { width: 0, height: 2 },
      },

      android: {
        elevation: 2,
      },
    }),
  },

  item: {
    textAlign: 'left',
 fontWeight:"700"
  },

  scroll: {
    flex: 1,
    borderRadius: 2,
  },

  scrollContainer: {
    paddingVertical: 8,
  },
});
