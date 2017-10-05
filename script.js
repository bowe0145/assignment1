/*jslint browser: true, node: true, white: true, unparam: true, sloppy: true*/
var ListItem = React.createClass({
    propTypes: {
        id: React.PropTypes.number
        , name: React.PropTypes.string
        , email: React.PropTypes.string
        , onDeleteButtonClicked: React.PropTypes.func
    }
    , render: function () {
        return (React.createElement("Li", {}, React.createElement("a", {
            href: "#/item/" + this.props.id
        }, this.props.name), React.createElement("br", {}), React.createElement("a", {
            href: "mailto:" + this.props.email
        }, this.props.email), React.createElement("button", {
            onClick: this.props.onDeleteButtonClicked
            , id: "item-" + this.props.id
        }, "X")))
    }
});
var List = React.createClass({
    propTypes: {
        items: React.PropTypes.array
        , onItemDeleted: React.PropTypes.func
    }
    , render: function () {
        // Get the list items
        var onItemDeletedProp = this.props.onItemDeleted;
        var listItems = this.props.items.map(function (item) {
                item.onDeleteButtonClicked = onItemDeletedProp;
                return React.createElement(ListItem, item);
            })
            // Display them
        return (React.createElement("ul", {}, listItems))
    }
});
var DisplayItemPage = React.createClass({
    propTypes: {
        id: React.PropTypes.number
        , name: React.PropTypes.string
        , email: React.PropTypes.string
        , onDeleteButtonClicked: React.PropTypes.func
    }
    , render: function () {
        return (React.createElement("div", {}, /* Quick ternary if to make it a bit more user friendly */ React.createElement("div", {}, this.props.name ? this.props.name : "No data"), React.createElement("a", {
            href: "mailto:" + this.props.email
        }, this.props.email), React.createElement("button", {
            onClick: this.props.onDeleteButtonClicked
            , id: "item-" + this.props.id
        }, "X")))
    }
});
var AddItemPage = React.createClass({
    propTypes: {
        name: React.PropTypes.string
        , email: React.PropTypes.string
        , onInputChanged: React.PropTypes.func.isRequired
        , onSubmit: React.PropTypes.func.isRequired
    }
    , onNameChange: function (data) {
        setState({
            name: data.target.value
        });
    }
    , onEmailChange: function (data) {
        setState({
            email: data.target.value
        });
    }
    , onSubmit: function (data) {
        // Tell the state about the data
        state.onItemAdded({
            name: this.props.name
            , email: this.props.email
        });
        // Reset the data so that when the user loads add they dont see their previous submit
        setState({
            name: ""
            , email: ""
        });
        // Maybe this is hacky but it's to set the page to main
        location.hash = "#/";
    }
    , render: function () {
        return (React.createElement("Div", {}, React.createElement("label", {
            htmlFor: "nameInput"
        }, "Enter a name: "), React.createElement("input", {
            type: "text"
            , id: "nameInput"
            , value: this.props.name
            , onChange: this.onNameChange
        }), React.createElement("label", {
            htmlFor: "emailInput"
        }, "Enter an email"), React.createElement("input", {
            type: "text"
            , id: "emailInput"
            , value: this.props.email
            , onChange: this.onEmailChange
        }), /* Button */ React.createElement("button", {
            onClick: this.onSubmit
        }, "Submit")))
    }
});
var NavBarItem = React.createClass({
    propTypes: {
        id: React.PropTypes.number
        , name: React.PropTypes.string
        , href: React.PropTypes.string
    }
    , render: function () {
        return (React.createElement("Li", {}, React.createElement("a", {
            href: this.props.href
        }, this.props.name)))
    }
});
var NavBar = React.createClass({
    propTypes: {
        items: React.PropTypes.array
    }
    , render: function () {
        var listLinks = this.props.links.map(function (link) {
            return React.createElement(NavBarItem, link);
        })
        return (React.createElement("Ul", {}, listLinks))
    }
});
var state = {};

function setState(changes) {
    var component = List;
    var componentProperties = {};
    // Set up the button event to delete listItems
    state.onItemDeleted = function (e) {
        var itemId = e.target.id.split('-')[1];
        var newListOfItems = [];
        for (var i = 0; i < state.items.length; i++) {
            if (state.items[i].id != itemId) {
                newListOfItems.push(state.items[i]);
            }
        }
        setState({
            items: newListOfItems
        });
    };
    state.onItemAdded = function (item) {
        var newListOfItems = state.items;
        var newKey = newListOfItems.length + 1;
        // Add the new item to the temp array
        newListOfItems.push(Object.assign({}, {
            key: newKey
            , id: newKey
        }, item));
        // Call the set state with the new data
        setState({
            items: newListOfItems
        });
    };
    state = Object.assign({}, state, changes);
    componentProperties = state;
    // Check if the location exists in the state
    if (state.location) {
        // Clean the location
        var cleanLocation = state.location.replace(/^#\/?|\/$/g, "").split("/");
        // Check if the hash matches any predefined routes
        switch (cleanLocation[0]) {
        case "new":
            component = AddItemPage;
            break;
        case "item":
            component = DisplayItemPage;
            componentProperties = state.items.find(function (i) {
                return i.key == cleanLocation[1];
            });
            break;
        default:
            component = List;
        }
    }
    var mainView = React.createElement(component, componentProperties);
    // Setup links
    var navBar = React.createElement(NavBar, {
        links: links
    });
    ReactDOM.render(mainView, document.getElementById("react-app"));
    ReactDOM.render(navBar, document.getElementById("react-navbar"));
}
window.addEventListener("hashchange", function () {
    setState({
        location: location.hash
    })
});
setState({
    items: items
})