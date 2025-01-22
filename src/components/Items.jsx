import "../css/items.css";
import { useEffect, useState } from "react";
import { GetProperties } from "../APIs/Properties/GetProperties.jsx";
import { Card, Carousel, Col, Image, Row } from "antd";
import { StarFilled } from "@ant-design/icons";
import { format } from "date-fns"; // Import date-fns

export default function Items() {
    const [properties, setProperties] = useState();

    useEffect(() => {
        async function fetchProperties() {
            try {
                const [data, error] = await GetProperties(); // Call the API function
                if (data) {
                    setProperties(data); // Update state with the fetched data
                } else {
                    console.error(error); // Log any errors
                }
            } catch (err) {
                console.error("An error occurred while fetching properties:", err);
            }
        }

        fetchProperties(); // Call the async function
    }, []);

    if (!properties) {
        return <div>Loading...</div>;
    }

    // Function to format the date range
    const formatDateRange = (startDate, endDate) => {
        const formattedStartDate = format(new Date(startDate), "ddMMM"); // Format start date
        const formattedEndDate = format(new Date(endDate), "ddMMM"); // Format end date
        return `${formattedStartDate} - ${formattedEndDate}`; // Combine into range
    };

    return (
        <div className={"itemsContainer"}>
            <div className={"items"}>
                <Row gutter={[16, 16]}>
                    {properties.map((card, index) => (
                        <Col
                            key={index}
                            xs={24}
                            sm={12}
                            md={8}
                            lg={6}
                            xl={6}
                        >
                            <Card
                                className={"property"}
                                bordered={false}
                                cover={
                                    <Carousel draggable={true} arrows={true}>
                                        {card.images.map((image, index) => (
                                            <Image
                                                key={index}
                                                src={image}
                                                alt={`${card.country}-${card.owner}-${index}`}
                                                preview={true}
                                            />
                                        ))}
                                    </Carousel>
                                }
                            >
                                <div className={"propertyDetails"}>
                                    <div className={"info"}>
                                        <div className={"location"}>
                                            {card.city} - {card.country}
                                        </div>
                                        <div className={"rate"}>
                                            <StarFilled style={{ color: "gold" }} />
                                            {card.property_rate}
                                        </div>
                                    </div>
                                    <div className={"owner"}>
                                        Stay With <span style={{ cursor: "pointer" }}> {card.owner}</span>
                                    </div>
                                    {/* Updated duration section */}
                                    <div className={"duration"}>
                                        {formatDateRange(card.start_date, card.end_date)}
                                    </div>
                                    <div className={"price"}>
                                        <span>$ {card.price}</span> / night
                                    </div>
                                </div>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>
        </div>
    );
}