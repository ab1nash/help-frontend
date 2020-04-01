import React, {useEffect} from 'react';
import { view } from 'react-easy-state';
import { useGoogleMap } from "@react-google-maps/api";


export const ZoomWatcher = view((props: any) => {
    const map = useGoogleMap();
    useEffect(() => {
        if (props.isUsingSingleMarker) {
            map.setZoom(17);
        }
    }, [props.isUsingSingleMarker]);
    return (<></>)
});
