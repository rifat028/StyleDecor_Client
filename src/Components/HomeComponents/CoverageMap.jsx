import React, { useRef } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const CoverageMap = ({ coverage }) => {
  const mapRef = useRef(null);

  const HandleSearch = (e) => {
    e.preventDefault();
    // console.log(e.target.searchText.value);
    const location = e.target.searchText.value;
    const district = coverage.find((dis) =>
      dis.district.toLowerCase().includes(location.toLowerCase())
    );
    // console.log(district);
    if (district) {
      mapRef.current.flyTo([district.latitude, district.longitude], 14);
    }
  };
  return (
    // heading
    <div>
      <h1 className="text-3xl md:text-5xl font-bold text-center dark:text-white py-6 md:py-10">
        Wanna get Connected? <br />
        <span className="text-purple-500">Find us in the </span>
        following areas
      </h1>
      {/* Search Box */}
      <div className="pb-3 md:pb-6 flex justify-center">
        <form onSubmit={HandleSearch} className="join">
          <div>
            <label className="input validator join-item">
              <input
                type="text"
                name="searchText"
                placeholder="Dhaka"
                required
              />
            </label>
          </div>
          <button className="btn btn-neutral join-item" type="submit">
            Search
          </button>
        </form>
      </div>
      {/* map section */}
      <MapContainer
        center={[23.8041, 90.4152]}
        zoom={7}
        scrollWheelZoom={false}
        className="border-gray-400 border-2 h-150 p=mx-2 md:mx-20 rounded-2xl"
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {coverage.map((area, index) => (
          <Marker position={[area.latitude, area.longitude]} key={index}>
            <Popup>
              {area.address}
              <br />
              <b>{area.district}</b>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default CoverageMap;
