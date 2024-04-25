import CameraRoll from "@react-native-community/cameraroll";
export default class CacheData {
  static data = [];
  static async getMedia(){
  await  CameraRoll.getPhotos({
        first: 2000,
        groupTypes: Platform.OS === 'ios' ? "All" : undefined,
        assetType: "All",
    }).then((result) => {
        const arr = result.edges.map(item => item.node);
        const dict = arr.reduce((prv, cur) => {
            const curValue = {
                type: cur.type,
                location: cur.location,
                timestamp: cur.timestamp,
                ...cur.image,
            };
            if (!prv[cur.group_name]) {
                prv[cur.group_name] = [curValue];
            } else {
                prv[cur.group_name].push(curValue);
            }
            return prv;
        }, {});
        const data = Object.keys(dict)
            .sort((a, b) => {
                const rootIndex = 'Camera Roll';
                if (a === rootIndex) {
                    return -1;
                } else if (b === rootIndex) {
                    return 1;
                } else {
                    return a < b ? -1 : 1;
                }
            })
            .map(key => ({name: key, value: dict[key]}));
            CacheData.data = data;
       
    });
  }
}