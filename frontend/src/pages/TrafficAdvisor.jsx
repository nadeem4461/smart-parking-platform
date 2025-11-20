import { useState } from "react";
import API from "../api/axios";
import { MapContainer,TileLayer,Polyline,Marker,Popup } from "react-leaflet";
import polyline from "@mapbox/polyline";


export default function TrafficAdvisor() {
    const [from,setFrom]= useState("Yeshwanthpur, Bengaluru");
    const [to,setTo]= useState("Yelahanka, Bengaluru");
    const [routeData, setRouteData]= useState(null);

    const getRoute= async()=>{
        const res= await API.get(`/traffic/route?from=${from}&to=${to}`);
        setRouteData(res.data);
    };
    return(
        <div className="p-6">
            <h2 className="text-xl font-bold text-blue-700 mb-4">🛣️ Smart Route Planner</h2>
            <div className="flex gap-2 mb-4">
                <input className="border p-2 rounded w-1/3" value={from} onChange={(e) => setFrom(e.target.value)} />
                <input className="border p-2 rounded w-1/3" value={to} onChange={(e) => setTo(e.target.value)} />
                <button onClick={getRoute} className="bg-blue-600 text-white px-4 py-2 rounded">
                    Find Routes
                </button>
            </div>
            
            
            {routeData && (
                <div className="font-medium text-gray-700">
                         <p className="font-medium text-gray-700">
            Traffic: <span className="font-bold text-red-500">{routeData.status}</span> ({routeData.trafficDelay})
          </p>
           <p className="mt-1">{routeData.suggestion}</p>
                
                <MapContainer center={[13.02, 77.59]} zoom={11} className="h-[400px] mt-4 rounded-lg shadow-lg">  
                   <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                   <Polyline 
                   positions={polyline.decode(routeData.route)}
                   color={routeData.status==="heavy"?"red":"green"}

                   weight={4}
                   />
                     {routeData.parkings.map((p, i) => (
              <Marker key={i} position={[p.latitude, p.longitude]}>
                <Popup>
                  <b>{p.name}</b>
                  <br />₹{p.price_2w_per_hour}/hr (2W)
                </Popup>
              </Marker>
            ))}
                </MapContainer>
                </div>
            )}

            
        </div>
    );

}