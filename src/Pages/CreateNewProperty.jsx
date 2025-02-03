import {Button, DatePicker, Form, Input, InputNumber, message, Upload} from "antd";
import {useEffect, useState} from "react";
import axios from "axios";
import {useCookies} from "react-cookie";
import moment from "moment";
import {PlusOutlined} from "@ant-design/icons";

export default function CreateNewProperty() {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [cookies, setCookies, removeCookie] = useCookies([]);
  const [state, setState] = useState(null);
  const [property, setProperty] = useState(null);
  useEffect(() => {
    if (cookies.jwt) {
      document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/property; domain=localhost";
    }
  }, [cookies.jwt, removeCookie]);
  useEffect(() => {
    const savedProperty = sessionStorage.getItem('property');
    const savedState = sessionStorage.getItem('state');
    if (savedProperty) {
      setProperty(JSON.parse(savedProperty));
    }
    if (savedState) {
      setState(savedState);
    }
  }, []);
  useEffect(() => {
    if (state === 'edit' && property.property) {
      form.setFieldsValue({
        city: property.property.city,
        country: property.property.country,
        place: property.property.place,
        price: property.property.price,
        typeOfProperty: property.property.type_of_property,
        numberOfRooms: property.property.bedrooms,
        numberOfBeds: property.property.beds,
        numberOfBathrooms: property.property.baths,
        numberOfGuests: property.property.max_guests,
        startDate: property.property.start_date ? moment(property.property.start_date) : null,
        endDate: property.property.end_date ? moment(property.property.end_date) : null,
        description: property.property.description,
      });

      if (property.property.images && property.property.images.length) {
        const imageFiles = property.property.images.map(image => ({
          url: image,
        }));
        setFileList(imageFiles);
      }
    }
  }, [state, property, form]);

  const handleUploadChange = ({fileList}) => {
    setFileList(fileList);
  };

  const disableEndDate = (currentDate) => {
    const startDate = form.getFieldValue("startDate");
    return currentDate && currentDate.isBefore(startDate, "day");
  };


  const handleSubmit = async (values) => {
    const formData = new FormData();
    formData.append("property[city]", values.city);
    formData.append("property[country]", values.country);
    formData.append("property[place]", values.place);
    formData.append("property[price]", values.price);
    formData.append("property[type_of_property]", values.typeOfProperty);
    formData.append("property[bedrooms]", values.numberOfRooms);
    formData.append("property[beds]", values.numberOfBeds);
    formData.append("property[baths]", values.numberOfBathrooms);
    formData.append("property[description]", values.description);
    formData.append("property[max_guests]", values.numberOfGuests);
    formData.append("property[start_date]", values.startDate.format("YYYY-MM-DD"));
    formData.append("property[end_date]", values.endDate.format("YYYY-MM-DD"));


    if (state === 'edit' && property && property.property.images) {
      property.property.images.forEach((imageUrl) => {

        const imageId = imageUrl.split('/').pop();
        formData.append("property[existing_images][]", imageId);
      });
    }


    fileList.forEach((file) => {
      if (file.originFileObj) {
        formData.append("property[images][]", file.originFileObj);
      }
    });

    try {
      const response = state === 'create' ?
        await axios.post(
          `http://127.0.0.1:3000/api/v1/properties`,
          formData,
          {
            headers: {
              Authorization: `${cookies.jwt}`,
              "Content-Type": "multipart/form-data",
            },
          }
        ) :
        await axios.patch(
          `http://127.0.0.1:3000/api/v1/properties/${property.property.id}`,
          formData,
          {
            headers: {
              Authorization: `${cookies.jwt}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

      message.success(state === 'create' ? "Property Created Successfully" : "Property Updated Successfully");
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    } catch (error) {
      console.log(error);
      message.error(state === 'create' ? "An error occurred while creating the property" : "An error occurred while updating the property");
    }
  };


  const beforeUpload = (file) => {
    const isValidFile = file.size / 1024 / 1024 < 3;
    if (!isValidFile) {
      message.error("File must be smaller than 3MB");
    }
    return isValidFile;
  };

  return (
    <div style={{padding: "20px", display: "flex", justifyContent: "center"}}>
      <div
        style={{
          width: "100%",
          maxWidth: "600px",
          backgroundColor: "#f9f9f9",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div
          style={{
            textAlign: "center",
            fontSize: "20px",
            fontWeight: "bold",
            fontFamily: "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace"
          }}>
          {state === 'create' ? "Create A New Property" : "Update Your Current Property"}
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            price: 0,
            numberOfRooms: 0,
            numberOfBeds: 0,
            numberOfBathrooms: 0,
            numberOfGuests: 0,
            startDate: null,
            endDate: null,
          }}
        >
          <Form.Item
            label="City"
            name="city"
            rules={[{required: true, message: "Please input the city"}]}
          >
            <Input placeholder="City"/>
          </Form.Item>

          <Form.Item
            label="Country"
            name="country"
            rules={[{required: true, message: "Please input the country"}]}
          >
            <Input placeholder="Country"/>
          </Form.Item>

          <Form.Item
            label="Place"
            name="place"
            rules={[{required: true, message: "Please input the place"}]}
          >
            <Input placeholder="Place"/>
          </Form.Item>

          <Form.Item
            label="Price Per Night"
            name="price"
            rules={[{required: true, message: "Please input the price"}]}
          >
            <InputNumber placeholder="Price" style={{width: "100%"}}/>
          </Form.Item>

          <Form.Item
            label="Type of Property"
            name="typeOfProperty"
            rules={[{required: true, message: "Please input the type of property"}]}
          >
            <Input placeholder="Type of Property"/>
          </Form.Item>

          <Form.Item
            label="Number of Rooms"
            name="numberOfRooms"
            rules={[{required: true, message: "Please input the number of rooms"}]}
          >
            <InputNumber placeholder="Rooms" style={{width: "100%"}}/>
          </Form.Item>

          <Form.Item
            label="Number of Beds"
            name="numberOfBeds"
            rules={[{required: true, message: "Please input the number of beds"}]}
          >
            <InputNumber placeholder="Beds" style={{width: "100%"}}/>
          </Form.Item>

          <Form.Item
            label="Number of Bathrooms"
            name="numberOfBathrooms"
            rules={[{required: true, message: "Please input the number of bathrooms"}]}
          >
            <InputNumber placeholder="Bathrooms" style={{width: "100%"}}/>
          </Form.Item>

          <Form.Item
            label="Number of Guests"
            name="numberOfGuests"
            rules={[{required: true, message: "Please input the number of guests"}]}
          >
            <InputNumber placeholder="Guests" style={{width: "100%"}}/>
          </Form.Item>

          <Form.Item
            label="Start Date"
            name="startDate"
            rules={[{required: true, message: "Please select the start date"}]}
          >
            <DatePicker style={{width: "100%"}}/>
          </Form.Item>

          <Form.Item
            label="End Date"
            name="endDate"
            rules={[{required: true, message: "Please select the end date"}]}
          >
            <DatePicker
              style={{width: "100%"}}
              disabledDate={disableEndDate}
            />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[{required: true, message: "Please input the description"}]}
          >
            <Input.TextArea placeholder="Description"/>
          </Form.Item>

          <Form.Item label="Upload Images">
            <Upload
              listType="picture-card"
              fileList={fileList}
              onChange={handleUploadChange}
              beforeUpload={beforeUpload}
              maxCount={5}
              showUploadList={{showRemoveIcon: true, showPreviewIcon: true}}
              style={{width: "100%"}}
            >
              {fileList.length >= 5 ? null : (
                <div
                  style={{
                    textAlign: "center",
                    cursor: "pointer",
                    border: "1px dashed #d9d9d9",
                    padding: "10px",
                    borderRadius: "4px",
                  }}
                >
                  <PlusOutlined/>
                  <div>Upload</div>
                </div>
              )}
            </Upload>
          </Form.Item>

          <Form.Item style={{textAlign: "center"}}>
            <Button
              type="primary"
              htmlType="submit"
              style={{width: "100%", fontSize: "16px", padding: "10px"}}
            >
              {state === 'create' ? "Create Property" : "Update Property"}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
