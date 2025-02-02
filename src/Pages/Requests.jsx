import {useOutletContext} from "react-router-dom";
import {useEffect, useState} from "react";
import {useCookies} from "react-cookie";
import {Image, Pagination} from "antd";
import "../css/requests.css";

export default function YourRequests() {
  const {UserProfile} = useOutletContext();
  const [cookies, removeCookie] = useCookies(["jwt"]);
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const pageSize = 5; // Number of requests per page

  useEffect(() => {
    if (cookies.jwt) {
      document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/profile/requests; domain=localhost";
    }
  }, [cookies.jwt, removeCookie]);

  useEffect(() => {
    if (UserProfile && UserProfile.user_reservations) {
      setRequests(UserProfile.user_reservations);
    }
  }, [UserProfile]);

  useEffect(() => {
    let filtered = requests;
    if (statusFilter !== "all") {
      filtered = requests.filter((req) => req.reservation.status === statusFilter);
    }
    setFilteredRequests(filtered);
  }, [requests, statusFilter]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  const paginatedRequests = filteredRequests.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  if (requests.length === 0) {
    return (
      <div style={{
        width: "80%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: "10px"
      }}>
        <svg width="300px" height="300px" viewBox="0 0 1024 1024" className="icon" version="1.1"
             xmlns="http://www.w3.org/2000/svg">
          <path
            d="M503.53152 344.4224m-262.5024 0a262.5024 262.5024 0 1 0 525.0048 0 262.5024 262.5024 0 1 0-525.0048 0Z"
            fill="#F2FAFE"/>
          <path
            d="M279.42912 725.46304v-0.04096l-3.47136 0.04096C164.33152 725.46304 73.6256 636.68224 71.71072 526.4384L71.68 522.9056C71.68 411.0336 163.14368 320.33792 275.968 320.33792c102.912 0 188.04736 75.4688 202.20928 173.62944h4.47488v-1.36192c0-127.32416 103.04512-230.77888 230.94272-232.83712l3.8912-0.03072C847.17568 259.7376 952.32 364.00128 952.32 492.5952c0 128.6144-105.14432 232.86784-234.83392 232.86784l2.60096-0.03072v0.03072H279.43936z"
            fill="#DFF1FB"/>
        </svg>
        <h1 style={{fontFamily: "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace"}}>No Sent
          Reservations</h1>
      </div>
    );
  }

  return (
    <div style={{width: "80%", margin: "0 auto", minHeight: "100vh", padding: "20px"}}>
      {/* Filter Dropdown */}
      <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px"}}>
        <h1 style={{
          fontFamily: "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace",
          fontSize: "28px"
        }}>Your Sent Requests</h1>
        <select value={statusFilter} onChange={handleStatusChange}
                style={{padding: "8px", borderRadius: "5px", border: "1px solid #ccc", fontSize: "16px"}}>
          <option value="all">All</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div style={{display: "flex", flexDirection: "column", gap: "15px"}}>
        {paginatedRequests.map((request) => (
          <div key={request.id} style={{
            display: "flex",
            alignItems: "center",
            padding: "15px",
            border: "1px solid #ddd",
            borderRadius: "10px",
            boxShadow: "2px 2px 10px rgba(0,0,0,0.1)"
          }}>
            <div>
              <Image src={request.property.images[0]} width={90} height={90}
                     style={{borderRadius: "50%", objectFit: "cover"}} preview={false}/>
            </div>
            <div style={{marginLeft: "15px", flex: 1}}>
              <div style={{display: "flex", justifyContent: "space-between", marginBottom: "5px"}}>
                <span style={{
                  fontSize: "22px",
                  fontWeight: "bold",
                  fontFamily: "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace"
                }}>{request.property.city}, {request.property.country}</span>
                <span style={{
                  padding: "5px 10px",
                  borderRadius: "5px",
                  color: "white",
                  fontFamily: "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace",
                  backgroundColor: request.reservation.status === "rejected" ? "#ff4d4f" : request.reservation.status === "approved" ? "#52c41a" : "#faad14"
                }}>
                  {request.reservation.status}
                </span>
              </div>
              <div style={{fontSize: "16px", color: "#555"}}>
                <p><span
                  style={{
                    fontFamily: "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace",
                    fontSize: 18
                  }}>Property Owner:</span> {request.user_profile}
                </p>
                <p><span style={{
                  fontFamily: "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace",
                  fontSize: 18,
                  letterSpacing: "-1px"
                }}>Type:</span> {request.property.type_of_property}</p>
                <p><span style={{
                  fontFamily: "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace",
                  fontSize: 18
                }}>Price per Night:</span> ${request.property.price}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {filteredRequests.length > pageSize && (
        <div style={{display: "flex", justifyContent: "center", marginTop: "20px"}}>
          <Pagination current={currentPage} total={filteredRequests.length} pageSize={pageSize}
                      onChange={handlePageChange}/>
        </div>
      )}
    </div>
  );
}
