import {useField} from "formik";
import {Form, Label} from "semantic-ui-react";
import DatePicker from 'react-datepicker';

// @ts-ignore
import {ReactDatePickerProps} from 'react-datepicker';
export default function MyDateInput(props: Partial<ReactDatePickerProps>) {
    const [field, meta, helpers] = useField(props.name);
    return <Form.Field error={meta.touched && !!meta.error}>
        <DatePicker
            {...field}
            {...props}
            selected={(field.value && new Date(field.value)) || null}
            onChange={value => helpers.setValue(value)}
        />
        {meta.touched && meta.error ? (
            <Label basic color='red'>{meta.error}</Label>
        ) : null}
    </Form.Field>;
    // const handleChange = (date: Date | null) => {
    //     helpers.setValue(date);
    // };
    // return (
    //     <Form.Field error={meta.touched && !!meta.error}>
    //         <DatePicker
    //             selected={(field.value && new Date(field.value)) || null}
    //             onChange={handleChange}
    //             // Prevent spreading unnecessary props that might cause issues
    //             {...props}
    //         />
    //         {meta.touched && meta.error ? (
    //             <Label basic color='red'>{meta.error}</Label>
    //         ) : null}
    //     </Form.Field>
    // );
}