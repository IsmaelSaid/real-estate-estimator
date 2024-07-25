import {useState} from "react";
import _ from "lodash";
import {Input, Label} from "semantic-ui-react";
import {motion} from 'framer-motion';

export const KMeansRegressorInput = ({onParametersChanges}: {
    onParametersChanges: (model: {
        modelName: string,
        parameters: { numberOfClusters: number | undefined },
        ready: boolean
    }) => void
}) => {
    const [k, setK] = useState<number | undefined>(undefined);
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newK = e.target.value === '' ? undefined : Number(e.target.value);
        setK(newK);
        onParametersChanges({
            modelName: 'KMeansRegressor',
            parameters: {numberOfClusters: newK},
            ready: !_.isUndefined(newK)
        });
    };
    return (
        <motion.div initial={{ opacity: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.1 }}>
            {/*            <h5>Description</h5>
            <p>Kmeans Regressor description</p>*/}
            <Input type='number' fluid placeholder='Number of clusters'>
                <input value={k || ''}
                       onChange={handleInputChange}/>
            </Input>
        </motion.div>
    );
}

/**
 *
 * @param {Object} props - The props for the component.
 * @param {Function} props.onParametersChanges - The function to be called when the radius state changes.
 */
export const RadiusRegressorInput = ({onParametersChanges}: {
    onParametersChanges: (model: {
        modelName: string,
        parameters: { radius: number | undefined },
        ready: boolean
    }) => void
}) => {
    const [radius, setRadius] = useState<number | undefined>(undefined);

    /**
     * The event handler for the onChange event of the input field.
     * It updates the radius state and calls the onParametersChanges function.
     *
     * @param {Object} e - The event object.
     */
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newRadius = e.target.value === '' ? undefined : Number(e.target.value);
        setRadius(newRadius);
        onParametersChanges({
            modelName: 'RadiusRegressor',
            parameters: {radius: newRadius},
            ready: !_.isUndefined(newRadius)
        });
    };

    // The component returns a div containing a description and an input field for the radius.
    return (
        <motion.div initial={{opacity: 0}}
                    animate={{opacity: 1, scale: 1}}
                    transition={{duration: 0.1}}>
            {/*            <h5>Description</h5>
            <p>Radius Regressor description</p>*/}
            <Input labelPosition='right' fluid type='number' placeholder='Area'>
                <input value={radius || ''}
                       onChange={handleInputChange}/>
                <Label>km<sup>2</sup></Label>
            </Input>
        </motion.div>
    );
}

/**
 *
 * @param {Object} props - The props for the component.
 * @param {Function} props.onParametersChanges - The function to be called when the radius state changes.
 */
export const KNNRegressorInput = ({onParametersChanges}: {
    onParametersChanges: (model: {
        modelName: string,
        parameters: { numberOfNeighbors: number | undefined },
        ready: boolean
    }) => void
}) => {
    const [numberOfNeighbors, setNumberOfNeighbors] = useState<number | undefined>(undefined);
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newNumberOfNeighbors = e.target.value === '' ? undefined : Number(e.target.value);
        setNumberOfNeighbors(newNumberOfNeighbors);
        onParametersChanges({
            modelName: 'KNNRegressor',
            parameters: {numberOfNeighbors: newNumberOfNeighbors},
            ready: !_.isUndefined(newNumberOfNeighbors)
        });
    };
    return (
        <motion.div initial={{opacity: 0}}
                    animate={{opacity: 1, scale: 1}}
                    transition={{duration: 0.1}}>
            {/*            <h5>Description</h5>
            <p>KNN regressor description</p>*/}
            <Input type='number' fluid placeholder='Number of neighbors'>
                <input value={numberOfNeighbors || ''}
                       onChange={handleInputChange}/>
            </Input>
        </motion.div>
    );
}

export const CityRegressorInput = () => {
    return <div style={{height: '38px', paddingBottom: '35px'}}>
        {/*        <h5>Description</h5>
        <p>City Regressor description</p>*/}
    </div>
}
