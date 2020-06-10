# Data Visualizations Showcase

This is a Showcase of all the different Data Viz projects I have created using
the D3.js library, Javascript, HTML, and CSS.

Projects will be displayed below with GIFs I made showcasing each one's
functionality.

However, each project can be demo-ed on your own PC by: 
1. Dowloading the corresponding project folder to your PC (ex: Marching Squares)
2. Opening the index.html file with Google Chrome or any 
   other popular browser by right clicking on it. 
   
   
# Parallel Coordinates

Parallel Coordinates View for multi-dimensional datasets. The data used for the scatterplot is Iris Flower Data that has Sepal/Petal length and width.

![parallelcoord](https://user-images.githubusercontent.com/31720526/84215219-755d4400-aa7a-11ea-9088-4e73633b6257.gif)

Skills learned and practiced in this project:
1. parallel views
2. brush.d3
3. svg paths
4. selecting and highlighting data

   
# Linked Views

Linked Views visualizes how two scatterplots can be linked together enabling them to interact with each other through selection and brushing. The data used for the scatterplot is Iris Flower Data that has Sepal/Petal length and width.

![parallel](https://user-images.githubusercontent.com/31720526/84212940-244a5180-aa74-11ea-80d2-7b3c97fe5de1.gif)

Skills learned and practiced in this project:
1. brush.d3
2. linking views
3. selecting and highlighting data

# Tree Map

TreeMap of the Flare dataset. 

![treemap](https://user-images.githubusercontent.com/31720526/84215327-cbca8280-aa7a-11ea-8abc-74651dc9fece.gif)

Skills learned and practiced in this project:
1. treemap view suitable for visualizing data hierarchies using containment
2. tree traversals in Javascript to compute geometric representations
3. limitations of using size and area to encode hierarchies

# Marching Squares 

Marching Squares visualizes two-dimensional scalar fields through the use of contours.
In this case I used the Hurricane Isabel dataset, with Temperature and Pressure being the scalar fields.

![Screen Shot 2020-06-09 at 5 04 15 PM](https://user-images.githubusercontent.com/31720526/84212706-6c1ca900-aa73-11ea-9c05-08a83f699bb5.png)
![Screen Shot 2020-06-09 at 5 04 21 PM](https://user-images.githubusercontent.com/31720526/84212702-6a52e580-aa73-11ea-9a0b-f54699b34c68.png)

Skills learned and practiced in this project:
1. Implementing the marching squares algorithm for extracting isocontours in a piecewise manner
2. Utilizing a case-table structure to maintain repeated computational structure and develop the algorithm in a compact way
3. d3.js library 
4. Experimenting with visual encoding of scalar fields utilizing both isocontour outlines and filled isocontours.

Example of a Case Table: 

![image](https://user-images.githubusercontent.com/31720526/79689164-dea5a100-8207-11ea-97b7-f9871855f752.png)


# Transitions in Data

This visualization is a scatterplot that can transition data by changing color or axis representation.

![calvinscores](https://user-images.githubusercontent.com/31720526/84215668-d1749800-aa7b-11ea-9332-0f82d1f26777.gif)

Skills learned and practiced in this project:
1. d3.js scales
2. d3.js axes
3. d3.js transitions

